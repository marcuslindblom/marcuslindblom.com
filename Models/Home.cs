using Strife;

public record Home(string Id, string? Heading, string? Introduction, List<Post>? Posts, List<Report> Analytics) : Content;