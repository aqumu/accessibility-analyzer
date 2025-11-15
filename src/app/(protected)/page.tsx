"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/mode-toggle";
import api from "@/lib/api";

// ---------- Progress Circle ----------
type TaskStage = "fetching" | "analyzing" | "generating" | "done";

const stageIndex: Record<TaskStage, number> = {
    fetching: 1,
    analyzing: 2,
    generating: 3,
    done: 3,
};

const ProgressCircle = ({ stage }: { stage: TaskStage }) => {
    const index = stageIndex[stage];
    const percentage = (index / 3) * 100;

    const radius = 16;
    const circumference = 2 * Math.PI * radius;

    const targetOffset = circumference - (percentage / 100) * circumference;

    const [animatedOffset, setAnimatedOffset] = useState(circumference);

    useEffect(() => {
        const raf = requestAnimationFrame(() => {
            setAnimatedOffset(targetOffset);
        });
        return () => cancelAnimationFrame(raf);
    }, [targetOffset]);

    return (
        <div className="w-10 h-10">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                {/* Background ring */}
                <circle
                    cx="18"
                    cy="18"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="3"
                    opacity="0.2"
                    fill="none"
                />
                {/* Animated ring */}
                <circle
                    cx="18"
                    cy="18"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={animatedOffset}
                    style={{ transition: "stroke-dashoffset 0.6s ease" }}
                />
            </svg>
        </div>
    );
};

export default function Dashboard() {
    interface Task {
        id: string;
        url: string;
        stage: TaskStage;
        report: any | null;
    }

    const [tasks, setTasks] = useState<Task[]>([]);
    const [newUrl, setNewUrl] = useState("");
    const [username, setUsername] = useState("");

    const updateTask = (id: string, stage: TaskStage, extra: any = {}) => {
        setTasks((t) =>
            t.map((task) => (task.id === id ? { ...task, stage, ...extra } : task))
        );
    };

    const fetchUsername = async () => {
        try {
            const res = await api.get("/users/me");
            setUsername(res.data.public_name || res.data.id || "Пользователь");
        } catch (err) {
            console.error("Ошибка при получении имени пользователя:", err);
        }
    };

    useEffect(() => {
        fetchUsername();
    }, []);

    const startAnalysis = async () => {
        if (!newUrl) return;

        let url = newUrl;
        if (!/^https?:\/\//i.test(url)) url = "https://" + url;

        const id = crypto.randomUUID();

        setTasks((t) => [...t, { id, url, stage: "fetching", report: null }]);
        setNewUrl("");

        try {
            await api.post("/analyze/start", { url });
            updateTask(id, "analyzing");

            await api.get(`/analyze/analyze?url=${encodeURIComponent(url)}`);
            updateTask(id, "generating");

            const report = await api.get(`/analyze/report?url=${encodeURIComponent(url)}`);
            updateTask(id, "done", { report: report.data });
        } catch (err) {
            console.error("Ошибка во время анализа:", err);
            updateTask(id, "done", {
                report: { error: "Не удалось проанализировать URL." },
            });
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="flex justify-between items-center px-4 py-2 border-b border-border">
                <Link
                    href="/user"
                    className="text-2xl font-semibold hover:text-primary transition-colors"
                >
                    {username || "Загрузка..."}
                </Link>
                <ModeToggle />
            </div>

            <div className="p-6 max-w-3xl mx-auto">
                <h2 className="text-xl font-semibold mb-4">Анализ URL</h2>

                <div className="flex gap-2 mb-6">
                    <Input
                        placeholder="Вставьте URL..."
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        aria-label="Поле для вставки URL"
                    />
                    <Button onClick={startAnalysis}>Анализировать</Button>
                </div>

                <h2 className="text-xl font-semibold mb-4">Ваши страницы</h2>

                {tasks.length === 0 ? (
                    <p>Проанализированных страниц пока нет.</p>
                ) : (
                    <div className="space-y-4">
                        {tasks.map((task) => (
                            <Card
                                key={task.id}
                                className="bg-card text-card-foreground border-border"
                            >
                                <CardHeader>
                                    <CardTitle>{task.url}</CardTitle>
                                </CardHeader>

                                <CardContent>
                                    {task.stage !== "done" ? (
                                        <div className="flex items-center gap-4">
                                            <ProgressCircle stage={task.stage} />

                                            <div className="text-sm">
                                                {task.stage === "fetching" && "Загрузка…"}
                                                {task.stage === "analyzing" && "Анализ…"}
                                                {task.stage === "generating" && "Генерация отчета…"}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-2">
                      <pre className="text-xs whitespace-pre-wrap bg-muted p-3 rounded">
                        {JSON.stringify(task.report, null, 2)}
                      </pre>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
