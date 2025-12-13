package net.zorphy.backend.main.file.component;

import net.zorphy.backend.config.property.BaseUrlProperty;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

@Component
public class FileUrlComponent {
    private final BaseUrlProperty baseUrlProperty;

    public FileUrlComponent(BaseUrlProperty baseUrlProperty) {
        this.baseUrlProperty = baseUrlProperty;
    }

    private String resolveUrl(String prefix, String filePath) {
        String baseUrl = baseUrlProperty.getBaseUrl();
        String fullPath;
        if (filePath == null) {
            //redirect empty images to placeholder
            fullPath = "files/static/empty.svg";
        } else {
            fullPath = prefix.isEmpty() ? filePath : prefix + "/" + filePath;
        }

        // Normalize slashes
        if (baseUrl.endsWith("/") && fullPath.startsWith("/")) {
            return baseUrl + fullPath.substring(1);
        } else if (!baseUrl.endsWith("/") && !fullPath.startsWith("/")) {
            return baseUrl + "/" + fullPath;
        } else {
            return baseUrl + fullPath;
        }
    }

    @Named("resolveFileUrl")
    public String resolveFileUrl(String filePath) {
        return resolveUrl("files", filePath);
    }

    @Named("resolveStaticUrl")
    public String resolveStaticUrl(String filePath) {
        return resolveUrl("", filePath);
    }
}
