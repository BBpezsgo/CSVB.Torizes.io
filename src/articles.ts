export type Article = {
    Name: string
    Group: string
    Time: { Start: string | number, End: string | number },
    ImageSources?: {
        [image: string]: string | {
            Label: string
            Url: string
        }
    }
}
