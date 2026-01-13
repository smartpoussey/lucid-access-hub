import { motion } from 'framer-motion';
import { FolderKanban, ArrowRight, ArrowLeft, Database, FileText, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useClientProjects } from '@/hooks/useClientProjects';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

export default function ClientDashboard() {
  const {
    projects,
    selectedProject,
    collections,
    selectedCollection,
    isLoadingProjects,
    isLoadingCollections,
    isLoadingDocuments,
    error,
    fetchProjects,
    selectProject,
    selectCollection,
    deselectProject,
    deselectCollection,
  } = useClientProjects();

  // Render document viewer
  if (selectedCollection) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={deselectCollection}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Collections
            </Button>
          </div>
          
          <div>
            <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-display font-bold text-foreground">
              {selectedCollection.name}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground mt-2">
              {selectedCollection.documents.length} document(s) in {selectedProject?.projectName}
            </motion.p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <ScrollArea className="h-[600px]">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
              {selectedCollection.documents.length === 0 ? (
                <Card className="bg-card border-border">
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No documents found in this collection.
                  </CardContent>
                </Card>
              ) : (
                selectedCollection.documents.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Card className="bg-card border-border">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-foreground font-mono">{doc.id}</CardTitle>
                          <Badge variant="outline">Document</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <pre className="text-sm text-muted-foreground bg-muted p-4 rounded-lg overflow-x-auto">
                          {JSON.stringify(doc.data, null, 2)}
                        </pre>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          </ScrollArea>
        </div>
      </DashboardLayout>
    );
  }

  // Render collections list
  if (selectedProject) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={deselectProject}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </div>
          
          <div>
            <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-display font-bold text-foreground">
              {selectedProject.projectName}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground mt-2">
              Select a collection to view its documents.
            </motion.p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoadingCollections ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Connecting to project...</span>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {collections.length === 0 ? (
                <Card className="bg-card border-border col-span-full">
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No accessible collections found in this project.
                  </CardContent>
                </Card>
              ) : (
                collections.map((collectionName, index) => (
                  <motion.div
                    key={collectionName}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Card 
                      className="bg-card border-border hover:border-primary/30 transition-all cursor-pointer group"
                      onClick={() => selectCollection(collectionName)}
                    >
                      <CardHeader>
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-2">
                          <Database className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-foreground group-hover:text-primary transition-colors">
                          {collectionName}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Button variant="ghost" className="w-full justify-between" disabled={isLoadingDocuments}>
                          {isLoadingDocuments ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Loading...
                            </>
                          ) : (
                            <>
                              View Documents <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  // Render project list
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-display font-bold text-foreground">
              My Projects
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-muted-foreground mt-2">
              Select a project to view its database collections.
            </motion.p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchProjects} disabled={isLoadingProjects}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingProjects ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoadingProjects ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading projects...</span>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length === 0 ? (
              <Card className="bg-card border-border col-span-full">
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No projects found.</p>
                  <p className="text-sm text-muted-foreground mt-1">Projects assigned to your account will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              projects.map((project, index) => (
                <motion.div
                  key={project.clientProjectId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card 
                    className="bg-card border-border hover:border-primary/30 transition-all cursor-pointer group"
                    onClick={() => selectProject(project)}
                  >
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                        <FolderKanban className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-foreground group-hover:text-primary transition-colors">
                        {project.projectName}
                      </CardTitle>
                      <CardDescription>
                        Project ID: {project.firebaseProjectId}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="ghost" className="w-full justify-between">
                        Open Dashboard <ArrowRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
