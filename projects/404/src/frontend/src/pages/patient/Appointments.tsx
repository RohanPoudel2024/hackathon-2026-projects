import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, ChevronRight, Filter } from "lucide-react"

export function Appointments() {
  const appointments = [
    {
      doctor: "Dr. Sarah Jenkins",
      specialty: "Cardiologist",
      date: "Oct 27, 2026",
      time: "10:30 AM",
      type: "In-Person",
      status: "Confirmed",
      location: "Central Medical Plaza, Room 402"
    },
    {
      doctor: "Dr. Michael Chen",
      specialty: "Dermatologist",
      date: "Nov 02, 2026",
      time: "02:15 PM",
      type: "Video Call",
      status: "Pending",
      location: "Online Consultation"
    }
  ]

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Appointments</h1>
          <p className="text-muted-foreground">Manage and track your upcoming healthcare visits.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700">
            Schedule New
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {appointments.map((appt, i) => (
          <Card key={i} className="border-none shadow-md shadow-slate-200/50 hover:shadow-lg transition-all overflow-hidden group">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="p-6 md:w-64 bg-slate-50 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-slate-100">
                  <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex flex-col items-center justify-center mb-2">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">{appt.date.split(' ')[0]}</span>
                    <span className="text-xl font-bold text-slate-900 leading-none">{appt.date.split(' ')[1].replace(',', '')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                    <Clock className="h-4 w-4 text-slate-400" /> {appt.time}
                  </div>
                </div>
                
                <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        appt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {appt.status}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                        {appt.type}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{appt.doctor}</h3>
                    <p className="text-emerald-600 font-medium text-sm">{appt.specialty}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                      <MapPin className="h-4 w-4" /> {appt.location}
                    </div>
                  </div>
                  
                  <div className="flex gap-3 shrink-0">
                    <Button variant="outline" className="rounded-xl border-slate-200 hover:bg-slate-50">
                      Reschedule
                    </Button>
                    <Button variant="outline" className="rounded-xl border-rose-100 text-rose-600 hover:bg-rose-50 hover:border-rose-200">
                      Cancel
                    </Button>
                    <Button size="icon" variant="ghost" className="rounded-xl text-slate-400 group-hover:text-emerald-600 transition-colors">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
