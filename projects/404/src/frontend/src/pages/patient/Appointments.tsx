
import { useAuth } from "@/hooks/useAuth";
import { useGetAppointmentsQuery } from "@/apis/appointmentsApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Clock, Video, Copy, Check } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function PatientAppointments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const patientId = user?.patient?.id;
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyLink = (appointmentId: string) => {
    const url = `${window.location.origin}/patient/consultation/${appointmentId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(appointmentId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const { data: appointments, isLoading } = useGetAppointmentsQuery(
    { patientId },
    { skip: !patientId }
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline" className="text-yellow-600 bg-yellow-50">{status}</Badge>;
      case "CONFIRMED":
        return <Badge className="bg-green-600 hover:bg-green-700">{status}</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">{status}</Badge>;
      case "COMPLETED":
        return <Badge variant="secondary">{status}</Badge>;
      case "RESCHEDULED":
        return <Badge variant="outline" className="text-blue-600 bg-blue-50">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">My Appointments</h2>
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Doctor</TableHead>
              <TableHead>Date &amp; Time</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!appointments || appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground italic">
                  No appointments found.
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((apt: any) => (
                <TableRow key={apt.id}>
                  <TableCell className="font-medium">
                    {apt.doctor?.user?.fullName || "Doctor"}
                    <div className="text-xs text-muted-foreground">{apt.doctor?.user?.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span className="text-sm font-medium">
                          {format(new Date(apt.startTime), "PPp")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 pl-5">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">to</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(apt.endTime), "p")}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{apt.reason || "N/A"}</TableCell>
                  <TableCell>{getStatusBadge(apt.status)}</TableCell>
                  <TableCell className="text-right">
                    {apt.status === "CONFIRMED" && apt.callSession?.id && (
                      <div className="flex flex-col items-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-purple-50 text-purple-600 hover:bg-purple-100 border-purple-200 gap-1.5"
                          onClick={() => navigate(`/patient/consultation/${apt.id}`)}
                        >
                          <Video className="w-4 h-4" />
                          Join Video Call
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs text-muted-foreground hover:text-foreground gap-1 px-2"
                          onClick={() => copyLink(apt.id)}
                        >
                          {copiedId === apt.id ? (
                            <><Check className="w-3 h-3 text-green-600" /> Copied!</>
                          ) : (
                            <><Copy className="w-3 h-3" /> Copy link</>
                          )}
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
