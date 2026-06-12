import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';

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

interface TaskProps {
  text: string;
  updateMode: () => void;
  deleteTask: () => void;
}

/*
 * Exercício 2: Componente refatorado para NativeWind.
 *   - Fundo branco com bordas arredondadas e sombra sutil.
 *   - Texto e botões de ação organizados em flex-row (justify-between).
 *
 * Exercício 4: Exclusão agora passa por AlertDialog de confirmação.
 */
const Task: React.FC<TaskProps> = ({ text, updateMode, deleteTask }) => {
  const [alertVisible, setAlertVisible] = useState(false);

  const handleConfirmDelete = () => {
    setAlertVisible(false);
    deleteTask();
  };

  return (
    <>
      {/* Exercício 2: container com NativeWind — bg-white, rounded, shadow, padding, flex-row */}
      <View className="bg-white rounded-xl shadow-md mt-4 px-4 py-4 flex-row items-center justify-between">
        <Text className="text-gray-800 text-base flex-1 mr-4">{text}</Text>

        <View className="flex-row gap-4">
          <TouchableOpacity onPress={updateMode} accessibilityRole="button">
            <Feather name="edit" size={20} color="#374151" />
          </TouchableOpacity>

          {/* Exercício 4: abre o AlertDialog em vez de excluir diretamente */}
          <TouchableOpacity onPress={() => setAlertVisible(true)} accessibilityRole="button">
            <AntDesign name="delete" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Exercício 4: AlertDialog de confirmação */}
      <AlertDialog isOpen={alertVisible} onClose={() => setAlertVisible(false)}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Text className="text-lg font-bold">Excluir Tarefa</Text>
          </AlertDialogHeader>

          <AlertDialogBody>
            <Text className="text-gray-600">
              Tem certeza que deseja excluir esta tarefa?
            </Text>
          </AlertDialogBody>

          <AlertDialogFooter className="flex-row justify-end gap-3">
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

export default Task;
