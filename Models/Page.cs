
public abstract record Page()
{
  public Metadata Metadata { get; init; } = new Metadata("My title", "My description");
}

public record Metadata(string? Title, string? Description);