using System;
using System.Threading;
using Akka.Actor;
using Akka.Configuration;

namespace <%= namespace %>
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var config = ConfigurationFactory.FromResource<Program>("<%= namespace %>.reference.conf");

            // create a new actor system (a container for actors)
            var system = ActorSystem.Create("MySystem", config);

            // create actor and get a reference to it.
            // this will be an "ActorRef", which is not a
            // reference to the actual actor instance
            // but rather a client or proxy to it
            var greeter = system.ActorOf<GreetingActor>("greeter");

            // send a message to the actor
            greeter.Tell(new Greet("World"));

            // prevent the application from exiting before message is handled
            // We have to do it this way because the docker container runs in
            // noninteractive mode, perhaps find a better way
            while (true)
            {
                Thread.Sleep(1);
            }
        }
    }
}