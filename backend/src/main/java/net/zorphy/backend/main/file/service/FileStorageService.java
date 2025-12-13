package net.zorphy.backend.main.file.service;

import net.zorphy.backend.main.file.dto.FileStorageFile;
import net.zorphy.backend.main.game.dto.GameType;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    /**
     * Saves a file to the following directory: files/games/{@code gameTypes}/.
     * Only use this method if the provided {@code file} is saved within the request context
     * @return The filepath to the saved file as it is saved in the database: games/{@code gameTypes}/
     */
    String saveFile(GameType gameType, MultipartFile file);

    /**
     * Saves a file to the following directory: files/{@code subDirectory}/.
     * Only use this method if the provided {@code file} is saved within the request context
     * @return The filepath to the saved file as it is saved in the database: {@code subDirectory}/
     */
    String saveFile(String subDirectory, MultipartFile file);

    /**
     * Saves a file to the following directory: files/games/{@code gameTypes}/.
     * Use this method if the provided {@code file} is not saved within the request context
     * @return The filepath to the saved file as it is saved in the database: games/{@code gameTypes}/
     */
    String saveFile(GameType gameType, FileStorageFile file);

    /**
     * Saves a file to the following directory: files/{@code subDirectory}/.
     * Use this method if the provided {@code file} is not saved within the request context
     * @return The filepath to the saved file as it is saved in the database: {@code subDirectory}/
     */
    String saveFile(String subDirectory, FileStorageFile file);

    /**
     * Deletes a file from the given path: files/{@code relativePath}
     */
    void deleteFile(String relativePath);
}
