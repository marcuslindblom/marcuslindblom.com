using Strife;
using Wieldy.Core.Models;

public record Article : Content {
  public string? Heading { get; set; }
  public string? Summary { get; set; }
  public Image? Image { get; set; }
  public string? Text { get; set; }

  public List<WebMention.Post> Mentions { get; set; } = new List<WebMention.Post>();
}