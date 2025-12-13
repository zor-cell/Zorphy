package net.zorphy.backend.main.all.component;

import org.commonmark.node.*;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;
import org.mapstruct.Named;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class FileReaderComponent {
    private final ResourceLoader resourceLoader;
    private final Parser parser;
    private final HtmlRenderer renderer;
    private final FileUrlComponent fileUrlComponent;
    private final Pattern imgSrcPattern = Pattern.compile("src=\"([^\"]+)\"");

    public FileReaderComponent(ResourceLoader resourceLoader, FileUrlComponent fileUrlComponent) {
        this.resourceLoader = resourceLoader;
        parser = Parser.builder()
                .build();
        renderer = HtmlRenderer.builder()
                .build();
        this.fileUrlComponent = fileUrlComponent;
    }

    @Named("readHtmlFromMarkdown")
    public String readHtmlFromMarkdown(String filePath) {
        String content = readContent(filePath);

        Node document = parser.parse(content);
        document.accept(new AbstractVisitor() {
            @Override
            public void visit(HtmlBlock htmlBlock) {
                String literal = htmlBlock.getLiteral();
                htmlBlock.setLiteral(rewriteImgSrc(literal));
                super.visit(htmlBlock);
            }
        });

        return renderer.render(document);
    }

    @Named("readTextFromMarkdown")
    public String readTextFromMarkdown(String filePath, int limit) {
        return readContent(filePath);
    }

    private String readContent(String filePath) {
        try {
            Resource resource = resourceLoader.getResource("classpath:" + filePath);
            if (!resource.exists()) {
                return "";
            }

            return resource.getContentAsString(StandardCharsets.UTF_8);
        } catch (IOException e) {
            return "";
        }
    }

    private String rewriteImgSrc(String html) {
        //rewrite html src="" tags with correct file path
        Matcher matcher = imgSrcPattern.matcher(html);
        StringBuilder sb = new StringBuilder();

        while (matcher.find()) {
            String filePath = matcher.group(1);

            int index = filePath.indexOf("static/");
            if(index != -1){
                filePath = filePath.substring(index + "static/".length());
            }

            String replacement = "src=\"" + fileUrlComponent.resolveStaticUrl(filePath) + "\"";
            matcher.appendReplacement(sb, Matcher.quoteReplacement(replacement));
        }
        matcher.appendTail(sb);

        return sb.toString();
    }
}
