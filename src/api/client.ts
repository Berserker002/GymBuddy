const BASE_URL = 'http://localhost:8000';

export interface ProgramInitRequest {
  profile: {
    gender: string;
    age: number;
    height_cm: number;
    weight_kg?: number;
    equipment: string;
    goal: string;
    training_days: number;
  };
  strength: Record<string, number | undefined>;
}

export interface ProgramInitResponse {
  id: string;
  days_per_week: number;
  days: { day: number; label: string; exercises: any[] }[];
}

export interface TodayWorkoutResponse {
  day: string;
  day_label: string;
  exercises: any[];
  workout_id: string;
}

export interface UpdateWorkoutRequest {
  workout_id: string;
  changes: unknown[];
}

export interface UpdateWorkoutResponse {
  status: string;
}

export interface LogWorkoutRequest {
  workout_id: string;
  exercise_id: string;
  actual_weight: number | null;
  target_weight: number | null;
  sets: number;
  reps: string;
  completed: boolean;
}

export interface LogWorkoutResponse {
  status: string;
}

export interface FinishWorkoutResponse {
  message?: string;
  progress?: Record<string, string> | null;
}

export type HistoryResponse = Record<string, { date: string; weight: number }[]>;

export interface ExerciseGuideRequest {
  exercise_name?: string;
  image_url?: string | null;
}

export interface ExerciseGuideResponse {
  muscles: string[];
  steps: string[];
  mistakes: string[];
  metadata?: Record<string, unknown>;
}

class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

const getAuthToken = () => process.env.EXPO_PUBLIC_API_TOKEN || 'demo-token';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');
  const body = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new ApiError(typeof body === 'string' ? body : body?.message || 'Request failed', response.status, body);
  }

  return body as T;
}

export async function initializeProgramFromBackend(body: ProgramInitRequest): Promise<ProgramInitResponse> {
  return request('/api/program/init', { method: 'POST', body: JSON.stringify(body) });
}

export async function getTodaysWorkout(): Promise<TodayWorkoutResponse> {
  return request('/api/workout/today');
}

export async function updateEditableWorkout(body: UpdateWorkoutRequest): Promise<UpdateWorkoutResponse> {
  return request('/api/workout/update', { method: 'PATCH', body: JSON.stringify(body) });
}

export async function logWorkout(body: LogWorkoutRequest): Promise<LogWorkoutResponse> {
  return request('/api/workout/log', { method: 'POST', body: JSON.stringify(body) });
}

export async function finishWorkout(workoutId: string): Promise<FinishWorkoutResponse> {
  return request(`/api/workout/finish?workout_id=${workoutId}`, { method: 'POST' });
}

export async function getExerciseHistory(exerciseId: string): Promise<HistoryResponse> {
  return request(`/api/history?exercise_id=${encodeURIComponent(exerciseId)}`);
}

export async function getExerciseGuide(body: ExerciseGuideRequest): Promise<ExerciseGuideResponse> {
  return request('/api/exercise/guide', { method: 'POST', body: JSON.stringify(body) });
}

export { ApiError };

export const apiClient = {
  initializeProgram: initializeProgramFromBackend,
  getTodaysWorkout,
  updateWorkout: updateEditableWorkout,
  logWorkout,
  finishWorkout,
  getHistory: getExerciseHistory,
  getExerciseGuide,
};
