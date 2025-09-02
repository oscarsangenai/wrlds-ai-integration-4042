import React, { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import * as htmlToImage from "html-to-image";
import { Download } from "lucide-react";
import { ORG_UNITS, OrgUnit, OrgMember, CATEGORY_ICON } from "@/data/orgChart";

type MemberCardProps = {
  member: OrgMember;
};

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
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
      <p className="font-semibold text-sm leading-tight">{member.name}</p>
      {member.role && (
        <p className="text-xs text-muted-foreground mt-1">{member.role}</p>
      )}
    </div>
  );
};

const DepartmentSection: React.FC<{
  department: OrgUnit;
  teams: OrgUnit[];
  onUnitClick: (unitId: string) => void;
}> = ({ department, teams, onUnitClick }) => {
  const Icon = CATEGORY_ICON[department.icon];
  
  const departmentMembers = department.members ?? [];

  return (
    <Card className="rounded-2xl border border-white/10 bg-white/40 backdrop-blur-sm shadow-lg">
      <CardHeader 
        className="rounded-t-2xl bg-gradient-to-r from-purple-50/80 to-blue-50/80 border-b border-white/20 cursor-pointer hover:bg-gradient-to-r hover:from-purple-100/80 hover:to-blue-100/80 transition-colors"
        onClick={() => onUnitClick(department.id)}
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
        </CardTitle>
      </CardHeader>
      
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
                <MemberCard key={idx} member={member} />
              ))}
            </div>
          </div>
        )}

        {/* Teams */}
        {teams.length > 0 && (
          <div className="space-y-4">
            {teams.map((team) => {
              const TeamIcon = CATEGORY_ICON[team.icon];

              return (
                <div key={team.id} className="rounded-2xl border border-white/20 bg-white/30 p-4 cursor-pointer hover:bg-white/40 transition-colors" onClick={() => onUnitClick(team.id)}>
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
                        <MemberCard key={idx} member={member} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const OrgChart3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  // Get organizational structure
  const { founders, executiveDirector, departments, departmentTeams, unitById } = useMemo(() => {
    const founders = ORG_UNITS.filter(unit => unit.type === 'founder');
    const executiveDirector = ORG_UNITS.find(unit => unit.type === 'executive-director');
    const departments = ORG_UNITS.filter(unit => unit.type === 'department');
    const departmentTeams = departments.map(dept => ({
      department: dept,
      teams: ORG_UNITS.filter(team => team.parentId === dept.id)
    }));
    
    // Create unit lookup map
    const unitById = new Map<string, OrgUnit>();
    ORG_UNITS.forEach(unit => unitById.set(unit.id, unit));

    return { founders, executiveDirector, departments, departmentTeams, unitById };
  }, []);

  const selectedUnit = selectedUnitId ? unitById.get(selectedUnitId) : null;

  const handleExportPng = async () => {
    if (!containerRef.current) return;
    
    // Hide sheet during export
    const elSheet = document.querySelector('[data-state="open"][role="dialog"]') as HTMLElement | null;
    const prevSheetDisplay = elSheet?.style.display;
    if (elSheet) elSheet.style.display = 'none';
    
    try {
      const dataUrl = await htmlToImage.toPng(containerRef.current, { 
        pixelRatio: 2,
        backgroundColor: undefined,
        style: {
          fontFamily: '"Product Sans", "Google Sans", "Inter", system-ui, sans-serif',
        }
      });
      
      const ts = new Date();
      const filename = `org-chart-${ts.getFullYear()}${String(ts.getMonth() + 1).padStart(2, '0')}${String(ts.getDate()).padStart(2, '0')}-${String(ts.getHours()).padStart(2, '0')}${String(ts.getMinutes()).padStart(2, '0')}.png`;
      
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      // Export failed silently
    } finally {
      if (elSheet) elSheet.style.display = prevSheetDisplay || '';
    }
  };

  return (
    <div 
      className="space-y-6 with-nav-safe-area nav-safe bg-org-gradient" 
      style={{ 
        fontFamily: '"Product Sans", "Google Sans", "Inter", system-ui, sans-serif',
        backgroundImage: 'linear-gradient(135deg, #000000 0%, #120017 40%, #2a0054 68%, #6b21a8 100%)'
      }}>
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white/20 shadow-lg">
        <div className="flex w-full lg:w-auto lg:max-w-md items-center gap-2">
          <h2 className="text-lg font-semibold">Gen AI Global Organization</h2>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            variant="outline" 
            onClick={handleExportPng} 
            className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border-white/30 rounded-2xl hover:from-purple-500/30 hover:to-blue-500/30 shadow-lg"
            aria-label="Export org chart as PNG"
          >
            <Download className="size-4 mr-2" /> 
            Export PNG
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/20 backdrop-blur-sm p-2 sm:p-4 shadow-xl">
        <div ref={containerRef} className="space-y-6 p-6 bg-white/95 rounded-2xl">
          {/* Founders */}
          {founders.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-center text-purple-800" 
                  style={{ fontFamily: '"Product Sans", "Google Sans", "Inter", system-ui, sans-serif' }}>
                Founders
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {founders.map((founder) => {
                  const Icon = CATEGORY_ICON[founder.icon];
                  return (
                    <Card key={founder.id} className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 shadow-lg cursor-pointer hover:shadow-xl transition-shadow" onClick={() => setSelectedUnitId(founder.id)}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-3" 
                                   style={{ fontFamily: '"Product Sans", "Google Sans", "Inter", system-ui, sans-serif' }}>
                          <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-purple-800">{founder.name}</h3>
                            <p className="text-sm text-purple-600 font-normal">{founder.description}</p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      {founder.members && founder.members.length > 0 && (
                        <CardContent className="pt-0">
                          <div className="grid gap-2">
                            {founder.members.map((member, idx) => (
                              <MemberCard key={idx} member={member} />
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Executive Director */}
          {executiveDirector && (
            <div className="max-w-lg mx-auto">
              <Card className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg cursor-pointer hover:shadow-xl transition-shadow" onClick={() => setSelectedUnitId(executiveDirector.id)}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3" 
                             style={{ fontFamily: '"Product Sans", "Google Sans", "Inter", system-ui, sans-serif' }}>
                    <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                      {React.createElement(CATEGORY_ICON[executiveDirector.icon], { className: "h-6 w-6" })}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-blue-800">{executiveDirector.name}</h3>
                      <p className="text-sm text-blue-600 font-normal">{executiveDirector.description}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                {executiveDirector.members && executiveDirector.members.length > 0 && (
                  <CardContent className="pt-0">
                    <div className="grid gap-2">
                      {executiveDirector.members.map((member, idx) => (
                        <MemberCard key={idx} member={member} />
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          )}

          {/* Departments */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-purple-800" 
                style={{ fontFamily: '"Product Sans", "Google Sans", "Inter", system-ui, sans-serif' }}>
              Departments
            </h2>
            {departmentTeams.map(({ department, teams }) => (
              <DepartmentSection
                key={department.id}
                department={department}
                teams={teams}
                onUnitClick={setSelectedUnitId}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Member Popup Sheet */}
      <Sheet open={!!selectedUnitId} onOpenChange={(open) => !open && setSelectedUnitId(null)}>
        <SheetContent side="right" className="w-full sm:w-[420px] max-w-[90vw]">
          <SheetHeader>
            <SheetTitle>{selectedUnit?.name}</SheetTitle>
            <SheetDescription className="capitalize">{selectedUnit?.type?.replace('-', ' ')}</SheetDescription>
          </SheetHeader>
          <div className="mt-4 grid gap-3 max-h-[70vh] overflow-auto">
            {selectedUnit?.members && selectedUnit.members.length > 0 ? (
              selectedUnit.members.map((member, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                  <div className="flex-1">
                    <p className="font-medium leading-tight">{member.name}</p>
                    {member.role && (
                      <p className="text-sm text-muted-foreground mt-1">{member.role}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No members listed.</p>
            )}
          </div>
          <div className="mt-4">
            <Button onClick={() => setSelectedUnitId(null)} className="w-full">
              Close
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default OrgChart3D;