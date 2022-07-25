using System.Reflection;

public record HomeViewModel {
  public string? Heading { get; set; }
  public List<Post>? Posts { get; set; } = new List<Post>();

  public static string InformationalVersion =>
    Assembly.GetEntryAssembly().GetCustomAttribute<AssemblyInformationalVersionAttribute>()?.InformationalVersion;
  public static string Sha =>
  InformationalVersion.Substring(InformationalVersion.LastIndexOf("-") + 1);
}