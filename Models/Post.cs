public record Post(string? Title, string? Description, string Slug, string? Text, List<WebMention.Post>? Mentions) : Page(Title, Description, Slug);