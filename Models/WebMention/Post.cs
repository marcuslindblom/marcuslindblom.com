using System.Text.Json.Serialization;

namespace WebMention;

public record Post(string Type, Author Author, Uri Url, DateTime Published, string Name, [property: JsonPropertyName("repost-of")] Uri RepostOf, [property: JsonPropertyName("wm-property")] string? WmProperty);
