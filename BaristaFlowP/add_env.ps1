$envVars = @{
    "VITE_FIREBASE_API_KEY"             = "AIzaSyC7aj3cnvSYdaho_upu_TUqpo2XDN4VrqE"
    "VITE_FIREBASE_AUTH_DOMAIN"         = "baristaflow-93ac0.firebaseapp.com"
    "VITE_FIREBASE_PROJECT_ID"          = "baristaflow-93ac0"
    "VITE_FIREBASE_STORAGE_BUCKET"      = "baristaflow-93ac0.appspot.com"
    "VITE_FIREBASE_MESSAGING_SENDER_ID" = "927603988215"
    "VITE_FIREBASE_APP_ID"              = "1:927603988215:web:e87c5f3fa71c0a470d65f2"
    "VITE_FIREBASE_MEASUREMENT_ID"      = "G-VTZSVCQPXH"
}

foreach ($key in $envVars.Keys) {
    $val = $envVars[$key]
    Write-Host "Adding $key..."
    Write-Output $val | npx vercel env add $key production
}
