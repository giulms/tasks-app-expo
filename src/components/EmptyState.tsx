import React from 'react';
import { View } from 'react-native';

// Exercício 5: Tipografia com Gluestack-UI (Text e Heading)
import { Heading, Text } from '@gluestack-ui/themed';

/*
 * Exercício 5: Componente de estado vazio.
 *   - View centralizada via NativeWind (flex-1 items-center justify-center).
 *   - Tipografia fornecida pelo Gluestack-UI (Heading + Text).
 *   Exibido quando a lista de tarefas filtrada está vazia.
 */
const EmptyState: React.FC = () => {
  return (
    <View className="flex-1 items-center justify-center my-10 px-6">
      <Heading size="lg" style={{ color: '#9ca3af', marginBottom: 8, textAlign: 'center' }}>
        Nenhuma tarefa encontrada
      </Heading>
      <Text size="md" style={{ color: '#9ca3af', textAlign: 'center' }}>
        Você ainda não tem tarefas. Toque em "Nova Tarefa" para começar!
      </Text>
    </View>
  );
};

export default EmptyState;
