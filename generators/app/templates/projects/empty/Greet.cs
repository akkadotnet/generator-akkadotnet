namespace <%= namespace %>
{
    public class Greet
    {
        public Greet(string who)
        {
            Who = who;
        }

        public string Who { get; }
    }
}