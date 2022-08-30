using System.Reflection;

public record Layout {
  private string? InformationalVersion { get; init; } = Assembly.GetEntryAssembly()?.GetCustomAttribute<AssemblyInformationalVersionAttribute>()?.InformationalVersion;
  public string? Sha => InformationalVersion?.Substring(InformationalVersion.LastIndexOf("-") + 1);
}