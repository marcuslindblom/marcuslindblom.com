using Strife;
public record Post : Content {
  public string? Id { get; set;}
  public string? Name { get; set; }
  public string? Summary { get; set; }
  public string? Text { get; set; }
  public List<WebMention.Post>? Mentions { get; set; } = new List<WebMention.Post>();
}