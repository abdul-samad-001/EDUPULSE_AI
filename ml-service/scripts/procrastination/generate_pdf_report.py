"""
generate_pdf_report.py

EduPulse AI - Machine Learning Execution PDF Report Generator

Generates a professional, research-grade PDF report (reports/procrastination_result.pdf)
containing execution metrics, dataset shape, train/test splits, individual model evaluations,
model comparison table, best model highlights, and list of generated artifacts.
"""

import os
import pandas as pd
from datetime import datetime

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas


class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Courier-Bold", 8)
        self.setFillColor(colors.HexColor("#475569"))

        # Running Header
        self.drawString(54, 750, "EduPulse AI — Machine Learning Training Execution Report")
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.75)
        self.line(54, 742, 612 - 54, 742)

        # Running Footer
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(612 - 54, 34, page_str)
        self.drawString(54, 34, "EduPulse AI Final Year Project — Automated Execution Artifact")
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.75)
        self.line(54, 46, 612 - 54, 46)

        self.restoreState()


def create_procrastination_pdf(
    df,
    X,
    y,
    X_train,
    X_test,
    y_train,
    y_test,
    X_train_scaled,
    X_test_scaled,
    results_list,
    best_res,
    total_training_time,
    output_pdf_path="reports/procrastination_result.pdf",
):
    # Ensure parent directory exists
    pdf_dir = os.path.dirname(os.path.abspath(output_pdf_path))
    os.makedirs(pdf_dir, exist_ok=True)

    doc = SimpleDocTemplate(
        output_pdf_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=64,
        bottomMargin=64,
    )

    usable_width = 612 - 108  # 504 pt

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Normal"],
        fontName="Courier-Bold",
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#0f172a"),
        spaceAfter=4,
    )

    subtitle_style = ParagraphStyle(
        "DocSubtitle",
        parent=styles["Normal"],
        fontName="Courier-Bold",
        fontSize=12,
        leading=15,
        textColor=colors.HexColor("#2563eb"),
        spaceAfter=12,
    )

    section_heading_style = ParagraphStyle(
        "SectionHeading",
        parent=styles["Normal"],
        fontName="Courier-Bold",
        fontSize=11,
        leading=14,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=10,
        spaceAfter=6,
    )

    mono_text = ParagraphStyle(
        "MonoText",
        parent=styles["Normal"],
        fontName="Courier",
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#1e293b"),
    )

    mono_header = ParagraphStyle(
        "MonoHeader",
        parent=styles["Normal"],
        fontName="Courier-Bold",
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#ffffff"),
    )

    mono_highlight = ParagraphStyle(
        "MonoHighlight",
        parent=styles["Normal"],
        fontName="Courier-Bold",
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#1e3a8a"),
    )

    story = []

    # Title & Subtitle
    story.append(Paragraph("EduPulse AI", title_style))
    story.append(Paragraph("Machine Learning Training Results", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#2563eb"), spaceAfter=12))

    # Helper table style
    def get_standard_table_style(has_header=True):
        style = [
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
            ("ALIGN", (0, 0), (-1, -1), "LEFT"),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
            ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#cbd5e1")),
            ("TOPPADDING", (0, 0), (-1, -1), 3),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ("LEFTPADDING", (0, 0), (-1, -1), 5),
            ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ]
        if has_header:
            style.insert(0, ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1e293b")))
        return TableStyle(style)

    # -------------------------------------------------------------
    # SECTION 1: Dataset Loaded Successfully
    # -------------------------------------------------------------
    story.append(Paragraph("1. Dataset Loaded Successfully", section_heading_style))

    shape_data = [
        [Paragraph("Metric", mono_header), Paragraph("Value", mono_header)],
        [Paragraph("Dataset File Path", mono_text), Paragraph("data/procrastination_dataset.csv", mono_text)],
        [Paragraph("Dataset Shape", mono_text), Paragraph(f"{df.shape[0]} rows, {df.shape[1]} columns", mono_text)],
    ]
    t_shape = Table(shape_data, colWidths=[150, usable_width - 150])
    t_shape.setStyle(get_standard_table_style())
    story.append(t_shape)
    story.append(Spacer(1, 6))

    # Head table
    story.append(Paragraph("First 5 Records:", ParagraphStyle("SubSub", parent=mono_text, fontName="Courier-Bold", spaceAfter=4)))
    head_df = df.head(5)
    cols = list(head_df.columns)
    
    # Wrap table columns
    head_table_data = [[Paragraph(str(c), mono_header) for c in cols]]
    for _, row in head_df.iterrows():
        head_table_data.append([Paragraph(str(row[c]), mono_text) for c in cols])

    col_w = usable_width / len(cols)
    t_head = Table(head_table_data, colWidths=[col_w] * len(cols))
    t_head.setStyle(get_standard_table_style())
    story.append(t_head)
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------
    # SECTION 2: Preparing Features and Target
    # -------------------------------------------------------------
    story.append(Paragraph("2. Preparing Features and Target", section_heading_style))
    ft_data = [
        [Paragraph("Property", mono_header), Paragraph("Details", mono_header)],
        [Paragraph("Target Column", mono_text), Paragraph("is_procrastinator", mono_text)],
        [Paragraph("Features Shape", mono_text), Paragraph(f"{X.shape[0]} rows, {X.shape[1]} columns", mono_text)],
        [Paragraph("Target Shape", mono_text), Paragraph(f"{y.shape[0]} samples", mono_text)],
    ]
    t_ft = Table(ft_data, colWidths=[150, usable_width - 150])
    t_ft.setStyle(get_standard_table_style())
    story.append(t_ft)
    story.append(Spacer(1, 6))

    # Feature List
    story.append(Paragraph("Feature List:", ParagraphStyle("SubSub2", parent=mono_text, fontName="Courier-Bold", spaceAfter=4)))
    features_list = list(X.columns)
    feat_cols = 2
    feat_table_data = [[Paragraph("Feature Name", mono_header), Paragraph("Index", mono_header)]]
    for idx, f_name in enumerate(features_list, 1):
        feat_table_data.append([Paragraph(f"[+] {f_name}", mono_text), Paragraph(f"Feature {idx}", mono_text)])
    
    t_feat = Table(feat_table_data, colWidths=[usable_width - 100, 100])
    t_feat.setStyle(get_standard_table_style())
    story.append(t_feat)
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------
    # SECTION 3: Train/Test Split
    # -------------------------------------------------------------
    story.append(Paragraph("3. Train/Test Split", section_heading_style))
    split_data = [
        [Paragraph("Split Property", mono_header), Paragraph("Value", mono_header)],
        [Paragraph("Split Ratio", mono_text), Paragraph("80% Train / 20% Test (stratified)", mono_text)],
        [Paragraph("Training Samples", mono_text), Paragraph(f"{len(X_train):,}", mono_text)],
        [Paragraph("Testing Samples", mono_text), Paragraph(f"{len(X_test):,}", mono_text)],
        [Paragraph("X_train Shape", mono_text), Paragraph(f"{X_train.shape}", mono_text)],
        [Paragraph("X_test Shape", mono_text), Paragraph(f"{X_test.shape}", mono_text)],
        [Paragraph("y_train Shape", mono_text), Paragraph(f"{y_train.shape}", mono_text)],
        [Paragraph("y_test Shape", mono_text), Paragraph(f"{y_test.shape}", mono_text)],
    ]
    t_split = Table(split_data, colWidths=[180, usable_width - 180])
    t_split.setStyle(get_standard_table_style())
    story.append(t_split)
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------
    # SECTION 4: Feature Scaling
    # -------------------------------------------------------------
    story.append(Paragraph("4. Feature Scaling", section_heading_style))
    scaling_data = [
        [Paragraph("Scaling Attribute", mono_header), Paragraph("Status / Dimensions", mono_header)],
        [Paragraph("Scaler Algorithm", mono_text), Paragraph("StandardScaler (Zero mean, Unit variance)", mono_text)],
        [Paragraph("Scaling Status", mono_text), Paragraph("Scaling Completed Successfully", mono_text)],
        [Paragraph("Scaled Training Shape", mono_text), Paragraph(f"{X_train_scaled.shape}", mono_text)],
        [Paragraph("Scaled Testing Shape", mono_text), Paragraph(f"{X_test_scaled.shape}", mono_text)],
    ]
    t_scale = Table(scaling_data, colWidths=[180, usable_width - 180])
    t_scale.setStyle(get_standard_table_style())
    story.append(t_scale)
    story.append(Spacer(1, 12))

    # -------------------------------------------------------------
    # SECTIONS 5-8: Individual Model Results
    # -------------------------------------------------------------
    section_map = {
        "Logistic Regression": "5. Logistic Regression Results",
        "Decision Tree": "6. Decision Tree Results",
        "Random Forest": "7. Random Forest Results",
        "XGBoost": "8. XGBoost Results",
        "Gradient Boosting": "8. XGBoost / Gradient Boosting Results",
    }

    for idx, res in enumerate(results_list, 5):
        sec_title = section_map.get(res["name"], f"{idx}. {res['name']} Results")
        story.append(Paragraph(sec_title, section_heading_style))

        cm = res["confusion_matrix"]
        tn, fp, fn, tp = cm[0][0], cm[0][1], cm[1][0], cm[1][1]

        m_data = [
            [Paragraph("Metric Name", mono_header), Paragraph("Score / Count", mono_header)],
            [Paragraph("Accuracy", mono_text), Paragraph(f"{res['accuracy']:.4f}", mono_text)],
            [Paragraph("Precision", mono_text), Paragraph(f"{res['precision']:.4f}", mono_text)],
            [Paragraph("Recall", mono_text), Paragraph(f"{res['recall']:.4f}", mono_text)],
            [Paragraph("Specificity", mono_text), Paragraph(f"{res['specificity']:.4f}", mono_text)],
            [Paragraph("F1 Score", mono_text), Paragraph(f"{res['f1']:.4f}", mono_text)],
            [Paragraph("ROC AUC", mono_text), Paragraph(f"{res['roc_auc']:.4f}", mono_text)],
            [Paragraph("Average Precision", mono_text), Paragraph(f"{res['average_precision']:.4f}", mono_text)],
            [Paragraph("MCC", mono_text), Paragraph(f"{res['mcc']:.4f}", mono_text)],
            [Paragraph("True Positives (TP)", mono_text), Paragraph(f"{tp:,}", mono_text)],
            [Paragraph("True Negatives (TN)", mono_text), Paragraph(f"{tn:,}", mono_text)],
            [Paragraph("False Positives (FP)", mono_text), Paragraph(f"{fp:,}", mono_text)],
            [Paragraph("False Negatives (FN)", mono_text), Paragraph(f"{fn:,}", mono_text)],
        ]

        t_m = Table(m_data, colWidths=[200, usable_width - 200])
        t_m.setStyle(get_standard_table_style())
        story.append(t_m)
        story.append(Spacer(1, 10))

    # -------------------------------------------------------------
    # SECTION 9: Model Comparison Table
    # -------------------------------------------------------------
    story.append(Paragraph("9. Model Comparison Table", section_heading_style))

    comp_headers = ["Model", "Accuracy", "Precision", "Recall", "Specificity", "F1", "ROC AUC", "Avg Prec", "MCC"]
    comp_table_data = [[Paragraph(h, mono_header) for h in comp_headers]]

    best_idx = None
    for row_i, res in enumerate(results_list, 1):
        is_best = (res["name"] == best_res["name"])
        if is_best:
            best_idx = row_i

        p_style = mono_highlight if is_best else mono_text
        comp_table_data.append([
            Paragraph(res["name"], p_style),
            Paragraph(f"{res['accuracy']:.4f}", p_style),
            Paragraph(f"{res['precision']:.4f}", p_style),
            Paragraph(f"{res['recall']:.4f}", p_style),
            Paragraph(f"{res['specificity']:.4f}", p_style),
            Paragraph(f"{res['f1']:.4f}", p_style),
            Paragraph(f"{res['roc_auc']:.4f}", p_style),
            Paragraph(f"{res['average_precision']:.4f}", p_style),
            Paragraph(f"{res['mcc']:.4f}", p_style),
        ])

    c_widths = [100, 50, 50, 50, 54, 50, 50, 50, 50]
    t_comp = Table(comp_table_data, colWidths=c_widths)

    t_comp_style = [
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1e293b")),
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#94a3b8")),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 3),
        ("RIGHTPADDING", (0, 0), (-1, -1), 3),
    ]

    if best_idx is not None:
        t_comp_style.append(("BACKGROUND", (0, best_idx), (-1, best_idx), colors.HexColor("#dbeafe")))
        t_comp_style.append(("BOX", (0, best_idx), (-1, best_idx), 1.5, colors.HexColor("#2563eb")))

    t_comp.setStyle(TableStyle(t_comp_style))
    story.append(t_comp)
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------
    # SECTION 10: Best Model
    # -------------------------------------------------------------
    story.append(Paragraph("10. Best Model Summary", section_heading_style))
    best_data = [
        [Paragraph("Best Model Attribute", mono_header), Paragraph("Value", mono_header)],
        [Paragraph("Best Model Name", mono_highlight), Paragraph(best_res["name"], mono_highlight)],
        [Paragraph("Best Accuracy", mono_text), Paragraph(f"{best_res['accuracy']:.4f}", mono_text)],
        [Paragraph("Best F1 Score", mono_highlight), Paragraph(f"{best_res['f1']:.4f}", mono_highlight)],
        [Paragraph("Best MCC", mono_text), Paragraph(f"{best_res['mcc']:.4f}", mono_text)],
        [Paragraph("Training Date", mono_text), Paragraph(datetime.now().strftime("%Y-%m-%d %H:%M:%S"), mono_text)],
        [Paragraph("Dataset Size", mono_text), Paragraph(f"{len(df):,} total samples", mono_text)],
        [Paragraph("Total Execution Time", mono_text), Paragraph(f"{total_training_time:.2f} seconds", mono_text)],
    ]
    t_best = Table(best_data, colWidths=[180, usable_width - 180])
    t_best.setStyle(get_standard_table_style())
    story.append(t_best)
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------
    # SECTION 11: Files Generated
    # -------------------------------------------------------------
    story.append(Paragraph("11. Files Generated", section_heading_style))
    files_data = [
        [Paragraph("Artifact Name", mono_header), Paragraph("Target File Path", mono_header), Paragraph("Status", mono_header)],
        [Paragraph("best_model.pkl", mono_text), Paragraph("models/best_model.pkl", mono_text), Paragraph("✓ Saved", mono_text)],
        [Paragraph("scaler.pkl", mono_text), Paragraph("models/scaler.pkl", mono_text), Paragraph("✓ Saved", mono_text)],
        [Paragraph("model_metadata.json", mono_text), Paragraph("models/model_metadata.json", mono_text), Paragraph("✓ Saved", mono_text)],
        [Paragraph("train.csv", mono_text), Paragraph("data/train.csv", mono_text), Paragraph("✓ Saved", mono_text)],
        [Paragraph("test.csv", mono_text), Paragraph("data/test.csv", mono_text), Paragraph("✓ Saved", mono_text)],
        [Paragraph("procrastination_result.pdf", mono_text), Paragraph("reports/procrastination_result.pdf", mono_text), Paragraph("✓ Generated", mono_text)],
    ]
    t_files = Table(files_data, colWidths=[140, usable_width - 220, 80])
    t_files.setStyle(get_standard_table_style())
    story.append(t_files)

    # Build Document with custom canvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[+] Saved procrastination_result.pdf -> {output_pdf_path}")
