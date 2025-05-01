namespace DoItOrExplode.Server.Models
{
    public class Todo
    {
        //private long id;

        //public Todo(long id, string name, string description, int urgency, DateTime dueDate)
        //{
        //    this.id = id;
        //    Name = name;
        //    Description = description;
        //    Urgency = urgency;
        //    DueDate = dueDate;
        //}

        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public int Urgency { get; set; }

        public DateTime DueDate { get; set; }

        //public Todo() { }
    }
}
