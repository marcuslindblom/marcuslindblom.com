public record Post {
  public string Id { get; init; } = default!;
  public string Title { get; init; } = default!;
  public string Text { get; init; } = default!;
  public List<WebMention.Post> Mentions { get; init; } = new List<WebMention.Post>();
}
