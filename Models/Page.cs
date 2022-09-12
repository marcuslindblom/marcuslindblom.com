
public abstract record Page()
{
  public Metadata Metadata { get; init; } = new Metadata("My title", "My description");
  public List<Block> Sections { get; init; } = new List<Block> { new Form() };
}

public record Metadata(string? Title, string? Description);
public record Block(string Id, string? Type);

public record Form() : Block(string.Empty, null);