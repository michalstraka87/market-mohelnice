export default function EmailConfirmationPage() {
  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📧</div>
          <h1 className="text-2xl font-bold text-gray-900">Potvrď svůj email</h1>
          <p className="text-gray-500 text-sm mt-2">Poslali jsme ti odkaz pro potvrzení</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
          {/* Kroky */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-sm font-bold text-red-600">
                1
              </div>
              <div>
                <p className="font-medium text-gray-900">Zkontroluj si email</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  Měl by ti přijít email od <strong>noreply@mail.app.supabase.io</strong>
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-sm font-bold text-red-600">
                2
              </div>
              <div>
                <p className="font-medium text-gray-900">Klikni na odkaz</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  V emailu najdeš odkaz <strong>"Potvrdit e-mail"</strong>
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-sm font-bold text-red-600">
                3
              </div>
              <div>
                <p className="font-medium text-gray-900">Budeš přihlášený</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  Poté se automaticky přihlásíš a uvidíš marketplace
                </p>
              </div>
            </div>
          </div>

          {/* Info box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-700">
              <strong>💡 Tip:</strong> Zkontroluj si také <strong>SPAM</strong> složku. Někdy si tam maily skončí.
            </p>
          </div>

          {/* Počkej instruktivně */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Email se obvykle doručí do <strong>1 minuty</strong>. Pokud nepřijde, zkontroluj:
            </p>
            <ul className="text-sm text-gray-500 mt-2 space-y-1">
              <li>✓ SPAM/Nevyžádaná pošta</li>
              <li>✓ Všechny složky v e-mailu</li>
              <li>✓ Správně napsaný email</li>
            </ul>
          </div>

          {/* CTA tlačítko */}
          <a
            href="https://mail.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center text-white font-medium py-3 rounded-xl transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#E84040' }}
          >
            📬 Otevřít Gmail
          </a>
        </div>

        {/* Otázka */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Email ti nepřišel?{' '}
            <a href="/registrace" className="font-medium" style={{ color: '#E84040' }}>
              Zkus registraci znovu
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
