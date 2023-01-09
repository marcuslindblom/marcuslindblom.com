using Strife;
public record Post(string Id, string? Text, List<WebMention.Post>? Mentions) : Content;