using System.Text.Json.Serialization;

namespace WebMention;

public record WebMention([property: JsonIgnore] string? Secret, Uri Source, Uri Target, Post Post);