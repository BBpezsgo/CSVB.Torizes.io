export type Article = {
    Name: string
    ImageSources?: {
        [image: string]: string | {
            Label: string
            Url: string
        }
    }
}
