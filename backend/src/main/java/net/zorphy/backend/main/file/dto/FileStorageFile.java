package net.zorphy.backend.main.file.dto;

public record FileStorageFile(
        String fileName,
        byte[] bytes
) {
}
