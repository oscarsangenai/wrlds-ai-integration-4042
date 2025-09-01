import React, { useMemo, useRef, useState, useEffect } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";
import {
  Search,
  Download,
  FileDown,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import { ORG_UNITS, OrgUnit, OrgMember, CATEGORY_ICON } from "@/data/orgChart";

const highlight = (text: string, query: string) => {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, "ig"));
  return (
    <>
      {parts.map((part, i) => (
        <span key={i} className={part.toLowerCase() === query.toLowerCase() ? "bg-accent/30 rounded px-0.5" : undefined}>
          {part}
        </span>
      ))}
    </>
  );
};

type MemberCardProps = {
  member: OrgMember;
  query: string;
};

const MemberCard: React.FC<MemberCardProps> = ({ member, query }) => {
  const isLead = member.role?.toLowerCase().includes('lead') || 
                 member.role?.toLowerCase().includes('director') || 
                 member.role?.toLowerCase().includes('head');

  return (
    <div
      className={cn(
        "relative rounded-2xl border bg-white/60 p-3 backdrop-blur-sm shadow-sm transition-all hover:scale-[1.02] hover:shadow-lg",
        "before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent",
        isLead && "border-amber-300 bg-amber-50/60"
      )}
      style={{ fontFamily: '"Product Sans", "Google Sans", "Inter", system-ui, sans-serif' }}
      aria-label={`${member.name}${member.role ? `, ${member.role}` : ""}`}
    >
      <p className="font-semibold text-sm leading-tight">{highlight(member.name, query)}</p>
      {member.role && (
        <p className="text-xs text-muted-foreground mt-1">{highlight(member.role, query)}</p>
      )}
    </div>
  );
};

const DepartmentSection: React.FC<{
  department: OrgUnit;
  teams: OrgUnit[];
  query: string;
  defaultOpen?: boolean;
  globalExpandAll?: boolean;
}> = ({ department, teams, query, defaultOpen = false, globalExpandAll = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const Icon = CATEGORY_ICON[department.icon];
  
  const departmentMembers = (department.members ?? []).filter((m) =>
    [m.name, m.role ?? ""].some((f) => f.toLowerCase().includes(query.toLowerCase()))
  );

  const relevantTeams = teams.filter(team => 
    team.members?.some(m => 
      [m.name, m.role ?? ""].some(f => f.toLowerCase().includes(query.toLowerCase()))
    ) || team.name.toLowerCase().includes(query.toLowerCase())
  );

  // Auto-open when searching and matches exist, or when globalExpandAll is true
  const shouldOpen = globalExpandAll || query ? (departmentMembers.length > 0 || relevantTeams.length > 0) : isOpen;

  return (
    <Card className="rounded-2xl border border-white/10 bg-white/40 backdrop-blur-sm shadow-lg">
      <CardHeader 
        className="cursor-pointer rounded-t-2xl bg-gradient-to-r from-purple-50/80 to-blue-50/80 border-b border-white/20"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardTitle className="flex items-center justify-between" 
                   style={{ fontFamily: '"Product Sans", "Google Sans", "Inter", system-ui, sans-serif' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-100/80 text-purple-600">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-purple-800">{department.name}</h3>
              <p className="text-sm text-muted-foreground font-normal">
                {departmentMembers.length + teams.reduce((acc, team) => acc + (team.members?.length || 0), 0)} total members
              </p>
            </div>
          </div>
          {shouldOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </CardTitle>
      </CardHeader>
      
      <Collapsible open={shouldOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent>
          <CardContent className="p-6 space-y-6">
            {/* Department Leaders */}
            {departmentMembers.length > 0 && (
              <div>
                <h4 className="font-semibold text-purple-700 mb-3" 
                    style={{ fontFamily: '"Product Sans", "Google Sans", "Inter", system-ui, sans-serif' }}>
                  Department Leadership
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {departmentMembers
                    .sort((a, b) => {
                      const aIsLead = a.role?.toLowerCase().includes('lead') || 
                                     a.role?.toLowerCase().includes('director') || 
                                     a.role?.toLowerCase().includes('head');
                      const bIsLead = b.role?.toLowerCase().includes('lead') || 
                                     b.role?.toLowerCase().includes('director') || 
                                     b.role?.toLowerCase().includes('head');
                      
                      if (aIsLead && !bIsLead) return -1;
                      if (!aIsLead && bIsLead) return 1;
                      return a.name.localeCompare(b.name);
                    })
                    .map((member, idx) => (
                    <MemberCard key={idx} member={member} query={query} />
                  ))}
                </div>
              </div>
            )}

            {/* Teams */}
            {teams.length > 0 && (
              <div className="space-y-4">
                {teams.map((team) => {
                  const teamMembers = (team.members ?? []).filter((m) =>
                    [m.name, m.role ?? ""].some((f) => f.toLowerCase().includes(query.toLowerCase()))
                  );
                  
                  if (query && teamMembers.length === 0 && !team.name.toLowerCase().includes(query.toLowerCase())) {
                    return null;
                  }

                  const TeamIcon = CATEGORY_ICON[team.icon];

                  return (
                    <div key={team.id} className="rounded-2xl border border-white/20 bg-white/30 p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-white/60 text-slate-600">
                          <TeamIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-slate-800" 
                              style={{ fontFamily: '"Product Sans", "Google Sans", "Inter", system-ui, sans-serif' }}>
                            {team.name}
                          </h5>
                          {team.description && (
                            <p className="text-sm text-muted-foreground">{team.description}</p>
                          )}
                        </div>
                      </div>
                      
                      {(team.members ?? []).length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {(team.members ?? [])
                            .sort((a, b) => {
                              const aIsLead = a.role?.toLowerCase().includes('lead') || 
                                             a.role?.toLowerCase().includes('director') || 
                                             a.role?.toLowerCase().includes('head');
                              const bIsLead = b.role?.toLowerCase().includes('lead') || 
                                             b.role?.toLowerCase().includes('director') || 
                                             b.role?.toLowerCase().includes('head');
                              
                              if (aIsLead && !bIsLead) return -1;
                              if (!aIsLead && bIsLead) return 1;
                              return a.name.localeCompare(b.name);
                            })
                            .map((member, idx) => (
                            <MemberCard key={idx} member={member} query={query} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

// Helper functions for localStorage
const getStoredExpandState = (): boolean => {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem('org-chart-expand-all');
  return stored === null ? true : stored === 'true';
};

const setStoredExpandState = (expanded: boolean): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('org-chart-expand-all', expanded.toString());
  }
};

interface OrgChart3DProps {}

const OrgChart3D: React.FC<OrgChart3DProps> = () => {
  const [globalExpandAll, setGlobalExpandAll] = useState<boolean>(getStoredExpandState);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Get organizational structure
  const { founders, executiveDirector, departments, departmentTeams } = useMemo(() => {
    const founders = ORG_UNITS.filter(unit => unit.type === 'founder');
    const executiveDirector = ORG_UNITS.find(unit => unit.type === 'executive-director');
    const departments = ORG_UNITS.filter(unit => unit.type === 'department');
    const departmentTeams = departments.map(dept => ({
      department: dept,
      teams: ORG_UNITS.filter(team => team.parentId === dept.id)
    }));

    return { founders, executiveDirector, departments, departmentTeams };
  }, []);

  const handleExportPng = async () => {
    if (!containerRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(containerRef.current, { 
        backgroundColor: undefined, // Let the gradient show through
        style: {
          fontFamily: '"Product Sans", "Google Sans", "Inter", system-ui, sans-serif',
        }
      });
      const link = document.createElement("a");
      const currentDate = new Date().toISOString().split('T')[0];
      link.download = `org-detailed-${currentDate}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error exporting PNG:', error);
    }
  };

  const handleExportPdf = async () => {
    if (!containerRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(containerRef.current, { 
        backgroundColor: undefined, // Let the gradient show through
        style: {
          fontFamily: '"Product Sans", "Google Sans", "Inter", system-ui, sans-serif',
        }
      });
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: "a4" });
      const { width, height } = pdf.internal.pageSize;
      pdf.addImage(dataUrl, "PNG", 0, 0, width, height);
      const currentDate = new Date().toISOString().split('T')[0];
      pdf.save(`org-detailed-${currentDate}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  const toggleGlobalExpand = () => {
    const newState = !globalExpandAll;
    setGlobalExpandAll(newState);
    setStoredExpandState(newState);
  };


  return (
    <div 
      className="space-y-6 with-nav-safe-area nav-safe bg-org-gradient" 
      style={{ 
        fontFamily: '"Product Sans", "Google Sans", "Inter", system-ui, sans-serif',
        backgroundImage: 'linear-gradient(135deg, #000000 0%, #120017 40%, #2a0054 68%, #6b21a8 100%)'
      }}>
      {/* Stylized Export Button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="lg"
          onClick={handleExportPng}
          className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border-2 border-purple-300/40 rounded-2xl hover:from-purple-500/30 hover:to-blue-500/30 hover:border-purple-300/60 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/20 text-white font-semibold px-8 py-3"
          data-testid="export-png"
          aria-label="Export organization chart as PNG"
        >
          <Download className="w-5 h-5 mr-3" />
          Export as PNG
        </Button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/20 backdrop-blur-sm p-2 sm:p-4 shadow-xl">
        <TransformWrapper
          initialScale={1}
          minScale={0.25}
          maxScale={2.5}
          wheel={{ step: 0.06 }}
          doubleClick={{ disabled: true }}
          pinch={{ step: 5 }}
          centerZoomedOut
          centerOnInit
          limitToBounds
          alignmentAnimation={{ sizeX: 150, sizeY: 150, animationTime: 220 }}
          onInit={(ref) => ref.centerView?.(1)}
        >
          {({ zoomIn, zoomOut, resetTransform, centerView }) => (
            <>
              <div className="mb-4 flex gap-2 hidden">
                <Button size="sm" variant="secondary" onClick={() => zoomIn()} 
                        className="rounded-xl" aria-label="Zoom in">
                  +
                </Button>
                <Button size="sm" variant="secondary" onClick={() => zoomOut()} 
                        className="rounded-xl" aria-label="Zoom out">
                  −
                </Button>
                <Button size="sm" variant="secondary" onClick={() => centerView?.(1)} 
                        className="rounded-xl" aria-label="Reset view">
                  Reset
                </Button>
              </div>
              <div className="relative h-[80vh] w-full overflow-hidden rounded-2xl border border-white/20">
                <div className="absolute right-3 top-3 z-overlay flex gap-2 pointer-events-auto">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    onClick={() => zoomIn()} 
                    className="rounded-xl bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white/90" 
                    aria-label="Zoom in"
                    data-testid="zoom-in"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    onClick={() => zoomOut()} 
                    className="rounded-xl bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white/90" 
                    aria-label="Zoom out"
                    data-testid="zoom-out"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    onClick={() => centerView?.(1)} 
                    className="rounded-xl bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white/90" 
                    aria-label="Reset view"
                    data-testid="reset-cards"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                <TransformComponent>
                  <div ref={containerRef} className="org-surface min-h-[80vh] w-full p-8">
                     <div className="mx-auto max-w-7xl space-y-8">
                         {/* Founders */}
                        <div className="text-center space-y-4">
                          <h2 className="text-2xl font-bold text-purple-800 mb-6">Founders</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                           {founders.map((founder) => {
                             const Icon = CATEGORY_ICON[founder.icon];
                             return (
                               <Card key={founder.id} className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50/80 to-blue-50/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
                                 <CardContent className="p-6 text-center">
                                   <div className="mx-auto mb-4 p-3 rounded-2xl bg-purple-100/80 text-purple-600 w-fit">
                                     <Icon className="h-6 w-6" />
                                   </div>
                                   <h3 className="font-bold text-lg text-purple-800">{founder.name}</h3>
                                   <p className="text-purple-600 text-sm">Founder</p>
                                 </CardContent>
                               </Card>
                             );
                           })}
                         </div>
                         
                         {/* Divider Arrow */}
                         <div className="flex justify-center mt-8 mb-4">
                           <ChevronDown className="h-8 w-8 text-purple-400" />
                         </div>
                       </div>

                       {/* Executive Director */}
                       {executiveDirector && (
                         <div className="text-center space-y-4 mt-8 md:mt-10">
                           <h2 className="text-2xl font-bold text-purple-800 mb-6">Executive Director</h2>
                           <div className="flex justify-center">
                             <Card className="rounded-2xl border-2 border-blue-300 bg-gradient-to-br from-blue-50/90 to-purple-50/90 backdrop-blur-sm shadow-xl transform scale-105 ring-1 ring-blue-400/30 max-w-md">
                               <CardContent className="p-8 text-center">
                                 <div className="mx-auto mb-4 p-3 rounded-2xl bg-blue-100/80 text-blue-600 w-fit">
                                   {React.createElement(CATEGORY_ICON[executiveDirector.icon], { className: "h-6 w-6" })}
                                 </div>
                                 <h3 className="font-bold text-xl text-blue-800">{executiveDirector.members?.[0]?.name}</h3>
                                 <p className="text-blue-600">{executiveDirector.members?.[0]?.role}</p>
                               </CardContent>
                             </Card>
                           </div>
                           
                           {/* Divider Arrow */}
                           <div className="flex justify-center mt-8 mb-4">
                             <ChevronDown className="h-8 w-8 text-purple-400" />
                           </div>
                         </div>
                       )}

                        {/* Departments */}
                        <div className="space-y-6 mt-8 md:mt-10">
                          <h2 className="text-2xl font-bold text-purple-800 text-center mb-8">Departments</h2>
                           <div className="flex flex-wrap justify-center gap-4 max-w-full">
                             {departmentTeams
                               .sort((a, b) => a.department.name.localeCompare(b.department.name))
                               .map(({ department, teams }) => (
                               <div key={department.id} className="flex-shrink-0 w-64 max-w-sm">
                                 <DepartmentSection
                                   department={department}
                                   teams={teams}
                                   query=""
                                   defaultOpen={globalExpandAll}
                                   globalExpandAll={globalExpandAll}
                                 />
                               </div>
                             ))}
                           </div>
                       </div>
                    </div>
                  </div>
                </TransformComponent>
              </div>
            </>
          )}
        </TransformWrapper>
      </div>
    </div>
  );
};

export default OrgChart3D;