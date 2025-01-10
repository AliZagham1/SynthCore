
"use client";
import { Card, CardContent } from "./ui/card";
import { CardHeader, CardTitle } from "./ui/card";

const testimonials = [
    {
        name : "Saba",
        avatar: "S",
        title:"Backend Developer",
        description:"Really effective tool for my job"
    },
    {
        name : "Alex",
        avatar: "A",
        title:"Frontend Developer",
        description:"One Stop Shop for all your needs"
    },
    {
        name : "Hadi",
        avatar: "H",
        title:"Frontend Developer",
        description:"Code Generation is a game-changer"
    },
    {
        name : "John",
        avatar: "J",
        title:"Ui/UX Designer",
        description:"Fun to use"
    }
]

export const LandingContent = () => {
    return <div className="px-10 pb-20">
        <h2 className = "text-4xl text-center mb-10 font-extrabold text-white">
            Testimonials
        </h2>
        <div className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4   ">
            {testimonials.map((test) => (
                <Card key = {test.name} className="bg-white/5 border-black/5 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="flex items-center gap-x-2">
                            <div>
                                <p className="text-lg">{test.name}</p>
                                <p className="text-xs text-zinc-400" >  {test.title}</p>
                            </div>

                        </CardTitle>
                        <CardContent className = "pt-4 px-0">
                            {test.description}

                        </CardContent>
                        
                    </CardHeader>

                        
              
                </Card>
            ))}

        </div>
        
        </div>
}