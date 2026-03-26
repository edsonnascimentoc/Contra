async function test() {
  console.log('🧪 Testando Bug #1 (Ano corrompido)...');
  const res1 = await fetch('http://localhost:3001/api/status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      projectName: 'Test Bug 1',
      phase: 'Test',
      startDate: '0002-01-01',
      endDate: '2024-01-01'
    })
  });
  console.log('Status:', res1.status);
  console.log('Body:', await res1.json());

  console.log('\n🧪 Testando Bug #6 (Inversão de data)...');
  const res2 = await fetch('http://localhost:3001/api/status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      projectName: 'Test Bug 6',
      phase: 'Test',
      startDate: '2024-05-01',
      endDate: '2024-01-01'
    })
  });
  console.log('Status:', res2.status);
  console.log('Body:', await res2.json());

  console.log('\n🧪 Testando Sucesso...');
  const res3 = await fetch('http://localhost:3001/api/status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      projectName: 'Test Success',
      phase: 'Test',
      status: 'PLANNING',
      startDate: '2024-01-01',
      endDate: '2024-06-01'
    })
  });
  console.log('Status:', res3.status);
  console.log('Body:', await res3.json());
}

test();
