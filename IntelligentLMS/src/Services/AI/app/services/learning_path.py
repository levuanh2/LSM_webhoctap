from typing import Literal

import networkx as nx
import pandas as pd
from app.data.dataset_builder import get_courses_df
from app.utils.logger import logger

PathReason = Literal["ok", "empty_graph", "not_in_graph", "cycle"]


class LearningPathService:
    _graph = None
    _last_course_count = 0

    @classmethod
    def _build_graph(cls):
        courses_df = get_courses_df()
        
        if courses_df.empty:
            cls._graph = nx.DiGraph()
            cls._last_course_count = 0
            return
            
        # Only rebuild if number of rows changes (a simple optimization for now)
        # Ideally, we hash the dataframe or trigger explicitly from dataset_builder
        if cls._graph is not None and len(courses_df) == cls._last_course_count:
            return

        logger.info("Rebuilding Learning Path Graph...")
        G = nx.DiGraph()
        
        for _, row in courses_df.iterrows():
            G.add_node(row['course_id'])
            
            if pd.notna(row['prerequisite_course_id']) and row['prerequisite_course_id'] != "":
                G.add_edge(row['prerequisite_course_id'], row['course_id'])
                
        cls._graph = G
        cls._last_course_count = len(courses_df)

    @classmethod
    def generate_path(cls, goal_course_id: str) -> tuple[list[str], PathReason]:
        """
        Dựng đồ thị prerequisite từ CSV AI. Trả về (path, lý do).
        Khi mã khóa (vd. UUID catalog) không có trong CSV → path một phần tử để UI vẫn dùng được.
        """
        cls._build_graph()
        G = cls._graph

        if G is None or G.number_of_nodes() == 0:
            logger.warning("Learning path graph is empty (no courses in AI CSV).")
            return [], "empty_graph"

        if goal_course_id not in G:
            logger.warning(
                "Goal course %s not in AI prerequisite graph (CSV course_id often differs from catalog UUID).",
                goal_course_id,
            )
            return [goal_course_id], "not_in_graph"

        ancestors = nx.ancestors(G, goal_course_id)
        subgraph = G.subgraph(list(ancestors) + [goal_course_id])

        if not nx.is_directed_acyclic_graph(subgraph):
            logger.error("Learning path has cyclic dependencies (not a DAG).")
            return [], "cycle"

        path = list(nx.topological_sort(subgraph))
        return path, "ok"

    @classmethod
    def force_rebuild(cls):
        cls._graph = None
        cls._build_graph()
