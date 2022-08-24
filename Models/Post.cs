public record Post {
  public string Id { get; init; } = default!;
  public string Title { get; init; } = default!;
  public string Text { get; init; } = default!;
  public List<WebMention.WebMention> WebMentions { get; init; } = default!;
}
