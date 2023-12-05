export type Article = {
    Name: string
    Group: string
    Time?: { Start: string, End: string } | string,
    ImageSources?: {
        [image: string]: string | {
            Label: string
            Url: string
        }
    }
    CardMetadata: import('./card-metadata').default
}
