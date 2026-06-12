import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TaskItem as TaskType } from '../utils/handle-api';
import useTaskStore from '../store/useTaskStore';

// Exercício 4: AlertDialog do Gluestack-UI para confirmação de exclusão
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  ButtonText,
} from '@gluestack-ui/themed';

interface TaskItemProps {
  task: TaskType;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const setEditingTask = useTaskStore((state) => state.setEditingTask);
  const router = useRouter();
  const [alertVisible, setAlertVisible] = useState(false);

  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  const handleConfirmDelete = () => {
    setAlertVisible(false);
    deleteTask(task._id);
  };

  return (
    <>
      <View style={styles.task}>
        <TouchableOpacity
          style={styles.contentContainer}
          onPress={() => router.push(`/task/${task._id}`)}
          accessibilityRole="button"
        >
          <Text style={[styles.text, !!task.completed && styles.textCompleted]}>
            {task.text}
          </Text>
          {task.dueDate && (
            <Text style={[styles.dateText, isOverdue ? styles.dateOverdue : styles.dateOnTime]}>
              Até: {new Date(task.dueDate).toLocaleDateString()}
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.icons}>
          <TouchableOpacity
            onPress={() => setEditingTask(task)}
            accessibilityRole="button"
          >
            <Feather name="edit" size={20} color="#fff" style={styles.icon} />
          </TouchableOpacity>

          {/* Exercício 4: abre AlertDialog em vez de excluir diretamente */}
          <TouchableOpacity onPress={() => setAlertVisible(true)} accessibilityRole="button">
            <AntDesign name="delete" size={20} color="#fff" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Exercício 4: modal de confirmação antes de excluir */}
      <AlertDialog isOpen={alertVisible} onClose={() => setAlertVisible(false)}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Excluir Tarefa</Text>
          </AlertDialogHeader>

          <AlertDialogBody>
            <Text style={{ color: '#555' }}>
              Tem certeza que deseja excluir esta tarefa?
            </Text>
          </AlertDialogBody>

          <AlertDialogFooter style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
            <Button variant="outline" onPress={() => setAlertVisible(false)}>
              <ButtonText>Cancelar</ButtonText>
            </Button>
            <Button action="negative" onPress={handleConfirmDelete}>
              <ButtonText>Excluir</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const styles = StyleSheet.create({
  task: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
    marginRight: 10,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  textCompleted: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  dateText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: 'bold',
  },
  dateOverdue: {
    color: '#e53935',
  },
  dateOnTime: {
    color: '#43a047',
  },
  icons: {
    flexDirection: 'row',
    gap: 16,
  },
  icon: {
    padding: 2,
  },
});

export default TaskItem;
