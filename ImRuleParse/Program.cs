public class Program
{
    private static void Main(string[] args)
    {
        string Path = @"C:\Users\Lobster\Desktop\IM_Rules\base.txt";
        string[] lines = File.ReadAllLines(Path);

        string title = lines[0];
        string description = lines[1];
       
        Console.WriteLine(title);
        Console.WriteLine(description);

        var sections = string.Join(Environment.NewLine, lines.Skip(2))
            .Split(new[] { "--- live", "--- test" }, StringSplitOptions.RemoveEmptyEntries)
            .Select(section => section.Trim())
            .ToArray();

        string[] subsections = null;
        // Extract subsections
        foreach (string section in sections)
        {
            subsections = section.Split(new[] { "Rule " }, StringSplitOptions.RemoveEmptyEntries);
            foreach (string subsection in subsections)
            {
                // Process each subsection
               // Console.WriteLine(subsection);
            }
        }

        Console.WriteLine(subsections[88]);
    }
}
