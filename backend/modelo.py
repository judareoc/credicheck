def evaluar(ingresos,gastos,obligaciones,antiguedad,situacion):
    disponible=ingresos-gastos-obligaciones
    ratio=(gastos+obligaciones)/ingresos
    if disponible<0 or ratio>0.80:
        clase="DESFAVORABLE"; motivo="El saldo mensual es negativo o la carga declarada supera el 80% de los ingresos."
    elif ratio>0.60 or antiguedad<6 or situacion=="desempleado":
        clase="REVISION_MANUAL"; motivo="El perfil requiere revisión adicional por carga financiera o estabilidad de ingresos."
    else:
        clase="FAVORABLE"; motivo="Los datos declarados muestran saldo mensual disponible bajo las reglas demostrativas."
    return round(disponible,2),round(ratio,4),clase,motivo
