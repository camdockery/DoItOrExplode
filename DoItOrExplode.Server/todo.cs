namespace DoItOrExplode.Server
{
    public class Todo
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public int Urgency { get; set; }

        public DateTime DueDate { get; set; }
    }
}
