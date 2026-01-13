import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getClientProjects } from '@/services/firestore.service';
import { 
  initializeClientProjectFirebase,
  projectToFirebaseConfig,
  listClientProjectCollections,
  getClientProjectCollectionDocs,
  deleteClientProjectFirebase,
} from '@/services/clientProject.service';
import type { ClientProject } from '@/types';

export interface CollectionData {
  name: string;
  documents: { id: string; data: Record<string, unknown> }[];
}

export function useClientProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<ClientProject | null>(null);
  const [collections, setCollections] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<CollectionData | null>(null);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingCollections, setIsLoadingCollections] = useState(false);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects for the logged-in client
  const fetchProjects = useCallback(async () => {
    if (!user?.userId) return;
    
    setIsLoadingProjects(true);
    setError(null);
    
    try {
      const clientProjects = await getClientProjects(user.userId);
      setProjects(clientProjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setIsLoadingProjects(false);
    }
  }, [user?.userId]);

  // Select a project and fetch its collections
  const selectProject = useCallback(async (project: ClientProject) => {
    setSelectedProject(project);
    setSelectedCollection(null);
    setIsLoadingCollections(true);
    setError(null);
    
    try {
      const config = projectToFirebaseConfig(project);
      
      // Initialize Firebase for this project
      initializeClientProjectFirebase(project.clientProjectId, config);
      
      // List available collections
      const collectionNames = await listClientProjectCollections(
        project.clientProjectId,
        config
      );
      
      setCollections(collectionNames);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to project');
      setCollections([]);
    } finally {
      setIsLoadingCollections(false);
    }
  }, []);

  // Fetch documents from a collection
  const selectCollection = useCallback(async (collectionName: string) => {
    if (!selectedProject) return;
    
    setIsLoadingDocuments(true);
    setError(null);
    
    try {
      const documents = await getClientProjectCollectionDocs(
        selectedProject.clientProjectId,
        collectionName
      );
      
      setSelectedCollection({
        name: collectionName,
        documents,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch collection');
      setSelectedCollection(null);
    } finally {
      setIsLoadingDocuments(false);
    }
  }, [selectedProject]);

  // Go back to project list
  const deselectProject = useCallback(async () => {
    if (selectedProject) {
      await deleteClientProjectFirebase(selectedProject.clientProjectId);
    }
    setSelectedProject(null);
    setCollections([]);
    setSelectedCollection(null);
  }, [selectedProject]);

  // Go back to collections list
  const deselectCollection = useCallback(() => {
    setSelectedCollection(null);
  }, []);

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (selectedProject) {
        deleteClientProjectFirebase(selectedProject.clientProjectId);
      }
    };
  }, [selectedProject]);

  return {
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
  };
}
