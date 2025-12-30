package net.zorphy.backend.main.file.service;

import net.zorphy.backend.config.property.FileStorageProperty;
import net.zorphy.backend.main.file.dto.FileStorageFile;
import net.zorphy.backend.main.game.dto.GameType;
import net.zorphy.backend.main.core.exception.FileStorageException;
import nu.pattern.OpenCV;
import org.opencv.core.Mat;
import org.opencv.core.MatOfByte;
import org.opencv.core.MatOfInt;
import org.opencv.imgcodecs.Imgcodecs;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {
    private static final Logger logger = LoggerFactory.getLogger(FileStorageServiceImpl.class);

    private final Path fileStorageLocation;
    private final int compressionRate;

    public FileStorageServiceImpl(FileStorageProperty fileStorageProperty) throws IOException {
        this.fileStorageLocation = Paths.get(fileStorageProperty.getDirectory()).toAbsolutePath().normalize();
        Files.createDirectories(this.fileStorageLocation);

        this.compressionRate = fileStorageProperty.getCompressionRate();

        logger.debug("File storage location initialized to: {}", this.fileStorageLocation);

        OpenCV.loadLocally();
    }

    @Override
    public String saveFile(GameType gameType, MultipartFile file) {
        if (file == null) return null;

        try {
            return this.saveFile(gameType, new FileStorageFile(file.getOriginalFilename(), file.getBytes()));
        } catch(IOException ex) {
            return null;
        }
    }

    @Override
    public String saveFile(String subDirectory, MultipartFile file) {
        if (file == null) return null;

        try {
            return this.saveFile(subDirectory, new FileStorageFile(file.getOriginalFilename(), file.getBytes()));
        } catch(IOException ex) {
            return null;
        }
    }

    @Override
    public String saveFile(GameType gameType, FileStorageFile file) {
        if (file == null) return null;

        String relativePath = "games/%s".formatted(gameType.toString().toLowerCase());
        return this.saveFile(relativePath, file);
    }

    @Override
    public String saveFile(String subDirectory, FileStorageFile file) {
        if (file == null) return null;

        try {
            return this.saveFileToWebp(subDirectory, file);
        } catch (Exception ex) {
            logger.info("Could not save bytes to webp", ex);
            return this.saveFileToOriginal(subDirectory, file);
        }
    }

    @Override
    public void deleteFile(String relativePath) {
        if (relativePath == null) {
            return;
        }

        try {
            Path filePath = this.fileStorageLocation.resolve(relativePath).normalize();

            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }
        } catch (IOException ex) {
            throw new FileStorageException("Could not delete bytes " + relativePath, ex);
        }
    }

    private String formatPath(String subDirectory, String filename) {
        subDirectory = subDirectory.replaceAll("^/+|/+$", ""); // remove leading/trailing slashes
        filename = filename.replaceAll("^/+", ""); // remove leading slashes

        return subDirectory + "/" + filename;
    }

    private String saveFileToOriginal(String subDirectory, FileStorageFile file) {
        if (file == null) return null;

        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.fileName()));

        try {
            //check for invalid characters
            if (originalFilename.contains("..")) {
                throw new FileStorageException("Filename contains invalid path sequence " + originalFilename);
            }

            //generate unique filename
            String fileExtension = "";
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex > 0 && dotIndex < originalFilename.length() - 1) {
                fileExtension = originalFilename.substring(dotIndex);
            }

            //get target directory
            Path subLocation = this.fileStorageLocation.resolve(subDirectory);
            Files.createDirectories(subLocation);

            //save original bytes
            String uniqueFilename = LocalDate.now() + "_" + UUID.randomUUID() + fileExtension;
            Path targetLocation = subLocation.resolve(uniqueFilename);
            Files.write(targetLocation, file.bytes(), StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);

            return formatPath(subDirectory, uniqueFilename);
        } catch (IOException ex) {
            throw new FileStorageException("Could not store bytes " + originalFilename, ex);
        }
    }

    private String saveFileToWebp(String subDirectory, FileStorageFile file) {
        if (file == null) return null;

        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.fileName()));

        try {
            //check for invalid characters
            if (originalFilename.contains("..")) {
                throw new FileStorageException("Filename contains invalid path sequence " + originalFilename);
            }

            //get target directory
            Path subLocation = this.fileStorageLocation.resolve(subDirectory);
            Files.createDirectories(subLocation);

            //save bytes in .webp format
            String uniqueFilename = LocalDate.now() + "_" + UUID.randomUUID() + ".webp";
            Path targetPath = subLocation.resolve(uniqueFilename);

            byte[] encoded = encodeWebp(file.bytes());

            Files.write(targetPath, encoded);

            return formatPath(subDirectory, uniqueFilename);
        } catch (IOException ex) {
            throw new FileStorageException("Could not store bytes " + originalFilename, ex);
        }
    }

    private byte[] encodeWebp(byte[] file) throws IOException {
        Mat image = Imgcodecs.imdecode(new MatOfByte(file), Imgcodecs.IMREAD_ANYCOLOR);

        MatOfInt params = new MatOfInt(Imgcodecs.IMWRITE_WEBP_QUALITY, compressionRate);
        MatOfByte output = new MatOfByte();

        if (Imgcodecs.imencode(".webp", image, output, params)) {
            return output.toArray();
        } else {
            throw new IOException("Failed to encode image as WebP with quality " + compressionRate);
        }
    }
}
