import networkx as nx
import pandas as pd
from app.data.dataset_builder import get_courses_df

class LearningPathService:
    @staticmethod
    def generate_path(goal_course_id: str) -> list[str]:
        """
        Uses NetworkX to build a directed graph of courses based on prerequisites.
        Returns the traversing path to reach the goal.
        """
        courses_df = get_courses_df()
        
        if courses_df.empty:
            return []
            
        # Initialize Directed Graph
        G = nx.DiGraph()
        
        # Add nodes and edges
        for _, row in courses_df.iterrows():
            G.add_node(row['course_id'])
            
            # If there's a prerequisite, add directed edge PREREQ -> CURRENT
            if pd.notna(row['prerequisite_course_id']) and row['prerequisite_course_id'] != "":
                G.add_edge(row['prerequisite_course_id'], row['course_id'])
                
        # Check if goal exists in the graph
        if goal_course_id not in G:
            return []
            
        # Find all ancestors (prerequisites) of the goal course
        # Using ancestor topological sort to define learning order
        ancestors = nx.ancestors(G, goal_course_id)
        
        # Build subgraph of ancestors and the goal
        subgraph = G.subgraph(list(ancestors) + [goal_course_id])
        
        if not nx.is_directed_acyclic_graph(subgraph):
            # Graph has cycles, cannot determine exact topological path
            print("Warning: Learning path has cyclic dependencies.")
            return list(ancestors) + [goal_course_id]
            
        # Return topologically sorted path
        path = list(nx.topological_sort(subgraph))
        return path
