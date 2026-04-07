import { useAnalyzeContent } from "@workspace/api-client-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScanLine, AlertTriangle, ShieldCheck, ShieldAlert, AlertOctagon, Terminal, Search, Zap } from "lucide-react";
import type { AnalysisResult, Claim } from "@workspace/api-client-react/src/generated/api.schemas";
import { Progress } from "@/components/ui/progress";

const EXAMPLES = [
  "Kal se internet band ho raha hai India mein, naya law pass ho gaya hai. Forward this to 10 groups.",
  "Drinking warm water with lemon cures all types of viral infections within 24 hours.",
  "Company X announces record profits for Q3, shares jump 15% in pre-market trading."
];

export default function Home() {
  const [content, setContent] = useState("");
  const mutation = useAnalyzeContent();

  const handleAnalyze = () => {
    if (!content.trim()) return;
    mutation.mutate({ data: { content } });
  };

  const result = mutation.data;

  return (
    <div className="min-h-screen w-full bg-background flex flex-col font-sans">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 p-1.5 border border-primary/30">
              <ScanLine className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-mono text-lg font-bold tracking-tight text-foreground uppercase">REALITY_CHECK<span className="text-primary">.SYS</span></h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8">
        
        {/* Input Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold font-mono tracking-tight flex items-center gap-2">
              <Terminal className="w-5 h-5 text-muted-foreground" />
              INPUT_SOURCE
            </h2>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-border opacity-50 blur-sm group-hover:opacity-100 transition duration-500"></div>
            <div className="relative flex flex-col bg-card border border-border">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/30">
                <div className="w-2.5 h-2.5 rounded-full bg-destructive/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-primary/50"></div>
                <span className="text-xs font-mono text-muted-foreground ml-2">target_text.txt</span>
              </div>
              <Textarea 
                placeholder="Paste text, news, or a forward here for forensic analysis..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[160px] resize-none border-0 focus-visible:ring-0 rounded-none bg-transparent font-mono text-sm leading-relaxed p-4"
              />
              <div className="p-4 border-t border-border bg-muted/10 flex items-center justify-between flex-wrap gap-4">
                <div className="flex gap-2 flex-wrap items-center">
                  <span className="text-xs font-mono text-muted-foreground mr-1">LOAD_SAMPLE:</span>
                  {EXAMPLES.map((ex, i) => (
                    <Button 
                      key={i} 
                      variant="outline" 
                      size="sm" 
                      className="text-xs font-mono h-7 bg-transparent hover:bg-primary/10 hover:text-primary hover:border-primary/50 border-border/50"
                      onClick={() => setContent(ex)}
                    >
                      [{i+1}]
                    </Button>
                  ))}
                </div>
                <Button 
                  onClick={handleAnalyze} 
                  disabled={!content.trim() || mutation.isPending}
                  className="font-mono bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 uppercase tracking-wider relative overflow-hidden group"
                >
                  {mutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <ScanLine className="w-4 h-4 animate-spin-slow" />
                      SCANNING...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      INITIATE_ANALYSIS
                    </span>
                  )}
                  <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Loading State */}
        {mutation.isPending && (
          <section className="py-20 flex flex-col items-center justify-center gap-6 animate-in fade-in zoom-in duration-500">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-primary/20 animate-pulse"></div>
              <div className="absolute inset-0 border-t-4 border-primary animate-spin"></div>
              <ScanLine className="w-10 h-10 text-primary animate-pulse" />
            </div>
            <div className="text-center font-mono space-y-2">
              <p className="text-lg text-foreground tracking-widest uppercase">Executing Forensic Scan</p>
              <div className="text-xs text-primary flex flex-col gap-1 opacity-80">
                <span>[system] parsing semantics...</span>
                <span>[system] cross-referencing claims...</span>
                <span>[system] detecting manipulative syntax...</span>
              </div>
            </div>
          </section>
        )}

        {/* Error State */}
        {mutation.isError && (
          <section className="p-6 border border-destructive bg-destructive/10 flex items-start gap-4 text-destructive font-mono">
            <AlertOctagon className="w-6 h-6 mt-0.5" />
            <div>
              <h3 className="font-bold text-lg uppercase tracking-wide">Analysis Failed</h3>
              <p className="text-sm opacity-90 mt-1">
                {(mutation.error as any)?.error || "An unexpected error occurred during the scan."}
              </p>
            </div>
          </section>
        )}

        {/* Results Dashboard */}
        {result && !mutation.isPending && (
          <section className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <h2 className="text-xl font-semibold font-mono tracking-tight flex items-center gap-2">
                <Search className="w-5 h-5 text-muted-foreground" />
                ANALYSIS_REPORT
              </h2>
              <span className="text-xs font-mono text-muted-foreground">ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Score Card */}
              <Card className="col-span-1 border-border/50 bg-card/50 overflow-hidden relative">
                {result.truthScore < 40 && <div className="absolute top-0 left-0 w-full h-1 bg-destructive"></div>}
                {result.truthScore >= 40 && result.truthScore < 70 && <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>}
                {result.truthScore >= 70 && <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>}
                
                <CardHeader className="pb-2">
                  <CardTitle className="font-mono text-sm tracking-wider text-muted-foreground">TRUTH_INDEX</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-6 gap-4">
                  <div className="relative flex items-center justify-center">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="56" className="stroke-muted fill-none stroke-[8]" />
                      <circle 
                        cx="64" 
                        cy="64" 
                        r="56" 
                        className={`fill-none stroke-[8] transition-all duration-1000 ease-out ${
                          result.truthScore < 40 ? 'stroke-destructive' : 
                          result.truthScore < 70 ? 'stroke-amber-500' : 'stroke-green-500'
                        }`}
                        style={{
                          strokeDasharray: 351.858,
                          strokeDashoffset: 351.858 - (351.858 * result.truthScore) / 100,
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black font-mono tracking-tighter">{result.truthScore}</span>
                    </div>
                  </div>
                  
                  <Badge 
                    variant="outline" 
                    className={`font-mono text-xs px-3 py-1 uppercase tracking-widest border ${
                      result.truthLabel === 'likely-false' ? 'bg-destructive/10 text-destructive border-destructive/30' :
                      result.truthLabel === 'suspicious' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' :
                      'bg-green-500/10 text-green-500 border-green-500/30'
                    }`}
                  >
                    {result.truthLabel === 'likely-false' && <ShieldAlert className="w-3 h-3 mr-2" />}
                    {result.truthLabel === 'suspicious' && <AlertTriangle className="w-3 h-3 mr-2" />}
                    {result.truthLabel === 'trustworthy' && <ShieldCheck className="w-3 h-3 mr-2" />}
                    {result.truthLabel}
                  </Badge>
                </CardContent>
              </Card>

              {/* Summary & Bias */}
              <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
                <Card className="border-primary/20 bg-primary/5 h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="font-mono text-sm tracking-wider text-primary">EXECUTIVE_SUMMARY</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-foreground/90 font-mono">
                      {result.simpleSummary}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="font-mono text-sm tracking-wider text-muted-foreground">BIAS_DETECTION</CardTitle>
                    <Badge variant="outline" className="font-mono bg-background text-foreground uppercase text-[10px]">
                      {result.bias !== "none" ? result.bias : "NO SIGNIFICANT BIAS"}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground font-mono">
                      {result.biasExplanation}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Claims Breakdown */}
            <div className="space-y-4">
              <h3 className="font-mono text-sm font-semibold tracking-widest text-muted-foreground uppercase">
                CLAIMS_ANALYSIS ({result.claims.length})
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {result.claims.map((claim, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-4 p-4 border border-border/50 bg-card/30 relative overflow-hidden group hover:bg-card/80 transition-colors">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                      claim.verdict === 'false' ? 'bg-destructive' :
                      claim.verdict === 'misleading' || claim.verdict === 'unverified' ? 'bg-amber-500' :
                      'bg-green-500'
                    }`}></div>
                    
                    <div className="sm:w-1/4 flex flex-col gap-2 shrink-0">
                      <Badge 
                        variant="outline" 
                        className={`w-fit font-mono text-[10px] uppercase border ${
                          claim.verdict === 'false' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                          claim.verdict === 'misleading' || claim.verdict === 'unverified' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                          'bg-green-500/10 text-green-500 border-green-500/20'
                        }`}
                      >
                        VERDICT: {claim.verdict}
                      </Badge>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <p className="text-sm font-medium text-foreground">"{claim.claim}"</p>
                      <p className="text-xs text-muted-foreground font-mono bg-background p-2 border border-border/50">
                        <span className="text-primary font-bold">REASON:</span> {claim.reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Manipulation Tactics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border/50 bg-card/50">
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="font-mono text-sm tracking-wider text-muted-foreground">MANIPULATION_TACTICS</CardTitle>
                  <Badge variant="outline" className={`font-mono uppercase text-[10px] ${
                    result.manipulationLevel === 'high' ? 'bg-destructive/20 text-destructive border-destructive/30' :
                    result.manipulationLevel === 'medium' ? 'bg-amber-500/20 text-amber-500 border-amber-500/30' :
                    'bg-background text-muted-foreground'
                  }`}>
                    LEVEL: {result.manipulationLevel}
                  </Badge>
                </CardHeader>
                <CardContent>
                  {result.manipulationDetails.length > 0 ? (
                    <div className="space-y-4 mt-2">
                      {result.manipulationDetails.map((tactic, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold font-mono text-foreground">{tactic.type}</span>
                            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 ${
                              tactic.severity === 'high' ? 'text-destructive bg-destructive/10' :
                              tactic.severity === 'medium' ? 'text-amber-500 bg-amber-500/10' :
                              'text-muted-foreground bg-muted'
                            }`}>
                              {tactic.severity}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {tactic.examples.map((ex, i) => (
                              <span key={i} className="text-xs font-mono bg-background border border-border/50 px-1.5 py-0.5 text-muted-foreground">
                                "{ex}"
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground font-mono py-4 text-center">No distinct manipulation tactics detected.</p>
                  )}
                </CardContent>
              </Card>

              {/* Highlighted Words */}
              <Card className="border-border/50 bg-card/50">
                <CardHeader className="pb-2">
                  <CardTitle className="font-mono text-sm tracking-wider text-muted-foreground">FLAGGED_KEYWORDS</CardTitle>
                </CardHeader>
                <CardContent>
                  {result.highlightedWords && result.highlightedWords.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {result.highlightedWords.map((word, idx) => (
                        <span key={idx} className="text-xs font-mono bg-destructive/10 text-destructive border border-destructive/20 px-2 py-1">
                          {word}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground font-mono py-4 text-center">No specific highly emotive or flagged keywords found.</p>
                  )}
                </CardContent>
              </Card>
            </div>

          </section>
        )}
      </main>
    </div>
  );
}
