namespace WebMention;

public record Root(string Type, string Name, List<Post> Children);
