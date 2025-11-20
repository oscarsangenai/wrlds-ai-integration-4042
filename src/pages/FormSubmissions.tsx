import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, RefreshCw, ExternalLink, Upload } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Submission {
  id: number;
  submission_id: string;
  full_name: string;
  email: string;
  primary_field_of_expertise: string;
  taken_mit_course: boolean;
  willing_to_volunteer: boolean;
  interested_in_volunteering: boolean;
  submitted_at: string;
  timezone: string;
}

const FormSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const webhookUrl = `https://neqkxwfvxwusrtzexmgk.supabase.co/functions/v1/gen-ai-global-admissions-webhook`;
  const importUrl = `https://neqkxwfvxwusrtzexmgk.supabase.co/functions/v1/import-gen-ai-global-admissions`;

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      // Get total count
      const { count } = await supabase
        .from("gen_ai_global_admissions")
        .select("*", { count: "exact", head: true });

      setTotalCount(count || 0);

      // Get recent submissions
      const { data, error } = await supabase
        .from("gen_ai_global_admissions")
        .select("*")
        .order("submitted_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      setSubmissions(data || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error fetching submissions:", errorMessage);
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const testWebhook = async () => {
    try {
      const testPayload = {
        mode: "test",
        sessionToken: "test-token",
        stepId: "7Fdi",
        model: {
          "7Fdi": {
            "3Q4U": { value: "Test User" },
            "5ZLy": { value: "test@example.com" },
            "8xUt": { value: "Software Development" },
            "sxJB": { value: "https://linkedin.com/in/testuser" },
            "3gMg": { value: "yes", selectedOptionIds: ["oUk8"] },
            "6vhu": { value: true },
            "bAiY": { value: true },
            "eK9t": { value: "Testing the webhook integration" },
            "ioT3": { value: "Advanced", selectedOptionIds: ["rcFt"] },
            "jEcc": { value: "Expert", selectedOptionIds: ["3BZp"] },
            "vCg5": { value: "Yes", selectedOptionIds: ["7ro9"] },
            "cRVh": { value: [] },
            "sZNa": { value: [] }
          }
        },
        globals: {
          submissionId: `test-${Date.now()}`
        },
        metadata: {
          timeToCompleteInSeconds: 120,
          timezone: "America/New_York"
        }
      };

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testPayload),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Test webhook successful!");
        fetchSubmissions();
      } else {
        toast.error(`Test failed: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Test failed: ${errorMessage}`);
    }
  };

  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error("Please upload a CSV file");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(importUrl, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(
          `Import completed! Success: ${result.stats.success}, Skipped: ${result.stats.skipped}, Errors: ${result.stats.errors}`
        );
        fetchSubmissions();
      } else {
        toast.error(`Import failed: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Import failed: ${errorMessage}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Form Submissions Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and monitor Gen AI Global admission form submissions
          </p>
        </div>

        {/* Webhook Configuration */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Webhook Configuration</CardTitle>
            <CardDescription>
              Use this webhook URL in your Fillout form settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Webhook URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={webhookUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border rounded-md bg-muted font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(webhookUrl)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={testWebhook} variant="outline">
                  Test Webhook
                </Button>
                <Button onClick={fetchSubmissions} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    window.open(
                      "https://supabase.com/dashboard/project/neqkxwfvxwusrtzexmgk/editor",
                      "_blank"
                    )
                  }
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Supabase
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CSV Import */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Import CSV from Fillout</CardTitle>
            <CardDescription>
              Upload a CSV export from Fillout to bulk import submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <label htmlFor="csv-upload">
                  <Button
                    variant="outline"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    asChild
                  >
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? "Importing..." : "Upload CSV File"}
                    </span>
                  </Button>
                </label>
              </div>
              <p className="text-sm text-muted-foreground">
                The CSV should be exported from Fillout with all form responses. 
                Duplicate submissions (based on Submission ID) will be automatically skipped.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Willing to Volunteer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {submissions.filter((s) => s.willing_to_volunteer).length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">MIT Course Taken</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {submissions.filter((s) => s.taken_mit_course).length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>Last 10 form submissions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No submissions yet. Test the webhook to create a sample submission.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Expertise</TableHead>
                      <TableHead>MIT Course</TableHead>
                      <TableHead>Volunteer</TableHead>
                      <TableHead>Submitted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">
                          {submission.full_name}
                        </TableCell>
                        <TableCell>{submission.email}</TableCell>
                        <TableCell>{submission.primary_field_of_expertise}</TableCell>
                        <TableCell>
                          {submission.taken_mit_course ? (
                            <Badge variant="default">Yes</Badge>
                          ) : (
                            <Badge variant="secondary">No</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {submission.willing_to_volunteer ? (
                            <Badge variant="default">Yes</Badge>
                          ) : (
                            <Badge variant="secondary">No</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(submission.submitted_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default FormSubmissions;
