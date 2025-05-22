namespace DoItOrExplode.Server.Models
{
    //The todo 
    public class Todo
    {
        //The id of the todo for the database
        public int Id { get; set; }
        //The todo's name
        public string Name { get; set; } = string.Empty;
        //The todo's description
        public string Description { get; set; } = string.Empty;
        //The todo's priority to get done
        public int Urgency { get; set; }
        //The due date of the todo
        public DateTime DueDate { get; set; }

    }
}
