using System;
using Akka.Actor;

namespace <%= namespace %>
{
    public class GreetingActor : ReceiveActor
    {
        public GreetingActor()
        {
            // Tell the actor to respond to the Greet message
            Receive<Greet>(greet => Console.WriteLine("Hello {0}", greet.Who));
        }
    }
}
