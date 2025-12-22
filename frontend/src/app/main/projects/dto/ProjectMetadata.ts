export interface ProjectMetadata {
    name: string,
    createdAt: Date,
    title: string,
    description: string,
    imagePath: string | null,
    githubUrl: string | null,
    hasWebsite: boolean,
    isFavorite: boolean
}