public record HomeViewModel {
  public string? Heading { get; set; }
  public List<Post>? Posts { get; set; } = new List<Post>();
}