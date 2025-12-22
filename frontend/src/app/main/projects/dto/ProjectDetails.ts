import {ProjectMetadata} from "./ProjectMetadata";

export interface ProjectDetails {
    metadata: ProjectMetadata,
    content: string,
    filePath: string
}