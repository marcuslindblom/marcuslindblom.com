using System.Text.Json.Serialization;

namespace WebMention;

public record Post(string Type,
  Author Author,
  Uri Url,
  DateTime? Published,
  string Name,
  [property: JsonPropertyName("wm-received")] DateTime WmRecieved,
  [property: JsonPropertyName("wm-id")] int WmId,
  [property: JsonPropertyName("wm-source")] Uri WmSource,
  [property: JsonPropertyName("wm-target")] Uri WmTarget,
  [property: JsonPropertyName("content")] Content Content,
  [property: JsonPropertyName("in-reply-to")] string? InReplyTo,
  [property: JsonPropertyName("like-of")] string? LikeOf,
  [property: JsonPropertyName("repost-of")] string? RepostOf,
  [property: JsonPropertyName("bookmark-of")] string? BookmarkOf,
  [property: JsonPropertyName("mention-of")] string? MentionOf,
  [property: JsonPropertyName("rsvp")] string? Rsvp,
  [property: JsonPropertyName("wm-property")] string WmProperty,
  [property: JsonPropertyName("wm-private")] bool WmPrivate);

public record Content(string Text);