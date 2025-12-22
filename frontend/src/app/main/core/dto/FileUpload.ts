export class FileUpload {
    private file: File | null = null;
    private fileUrl: string | null = null;

    /**
     * Set the file and create internal file URL
     */
    public setFile(file: File) {
        this.revokeUrl();
        this.file = file;
        this.fileUrl = URL.createObjectURL(file);
    }

    public getFileUrl() {
        return this.fileUrl;
    }

    /**
     * Get the file and revoke the URL for cleanup
     */
    public getAndRevokeFile(): File | null {
        const f = this.file;
        this.revokeFile();
        return f;
    }

    /**
     * Revoke the file URL for cleanup
     */
    public revokeFile() {
        this.revokeUrl();
        this.file = null;
    }

    private revokeUrl() {
        if (this.fileUrl) {
            URL.revokeObjectURL(this.fileUrl);
            this.fileUrl = null;
        }
    }
}